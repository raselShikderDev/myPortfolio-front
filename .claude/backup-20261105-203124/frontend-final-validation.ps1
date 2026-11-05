
$ErrorActionPreference = "Stop"

function Get-ScriptName {
    param(
        [object]$Scripts,
        [string[]]$Candidates
    )

    foreach ($candidate in $Candidates) {
        if ($Scripts.PSObject.Properties.Name -contains $candidate) {
            return $candidate
        }
    }

    return $null
}

function Invoke-Validation {
    param(
        [string]$Name,
        [string]$ScriptName,
        [string[]]$Arguments = @(),
        [string]$CommandType = "Script"
    )

    if ($CommandType -eq "BunTest") {
        $output = & bun test @Arguments 2>&1
    }
    elseif ($Arguments.Count -gt 0) {
        $output = & bun run $ScriptName @Arguments 2>&1
    }
    else {
        $output = & bun run $ScriptName 2>&1
    }

    $exitCode = $LASTEXITCODE

    $details = ($output | ForEach-Object { "$_" }) -join "`n"

    if ($details.Length -gt 12000) {
        $details = $details.Substring($details.Length - 12000)
    }

    return @{
        Name     = $Name
        Passed   = ($exitCode -eq 0)
        ExitCode = $exitCode
        Output   = $details
    }
}

function Add-SkippedResult {
    param([string]$Name, [string]$Reason)

    return @{
        Name     = $Name
        Passed   = $true
        Skipped  = $true
        ExitCode = $null
        Output   = $Reason
    }
}

try {
    # Read Claude Code Stop event JSON.
    $rawInput = [Console]::In.ReadToEnd()

    if ([string]::IsNullOrWhiteSpace($rawInput)) {
        throw "Stop hook received no event JSON."
    }

    $event = $rawInput | ConvertFrom-Json

    # Prevent repeated Stop-hook blocking.
    if ($event.stop_hook_active -eq $true) {
        [Console]::Error.WriteLine(
            "STOP HOOK: Already continuing because of a previous Stop hook. Allowing this stop to avoid a loop."
        )
        exit 0
    }

    $root = $env:CLAUDE_PROJECT_DIR

    if ([string]::IsNullOrWhiteSpace($root)) {
        $root = $event.cwd
    }

    if (-not $root -or -not (Test-Path -LiteralPath $root)) {
        throw "Could not identify the frontend project directory."
    }

    $packagePath = Join-Path $root "package.json"

    if (-not (Test-Path -LiteralPath $packagePath)) {
        throw "Frontend package.json was not found."
    }

    if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
        throw "Bun was not found in PATH."
    }

    $package = Get-Content $packagePath -Raw | ConvertFrom-Json
    $scripts = $package.scripts

    if (-not $scripts) {
        throw "No scripts section found in package.json."
    }

    Set-Location $root

    $results = @()

    # 1. TypeScript validation.
    $typeScript = Get-ScriptName $scripts @(
        "typecheck",
        "type-check",
        "check-types"
    )

    if ($typeScript) {
        $results += Invoke-Validation `
            -Name "TypeScript" `
            -ScriptName $typeScript
    }
    else {
        $results += Add-SkippedResult `
            -Name "TypeScript" `
            -Reason "No dedicated TypeScript check script configured. Build validation may include type checking."
    }

    # 2. ESLint.
    $lintScript = Get-ScriptName $scripts @("lint")

    if ($lintScript) {
        $results += Invoke-Validation `
            -Name "ESLint" `
            -ScriptName $lintScript
    }
    else {
        $results += @{
            Name     = "ESLint"
            Passed   = $false
            Skipped  = $false
            ExitCode = $null
            Output   = "Required lint script is missing from package.json."
        }
    }

    # 3. Full test suite.
    $testScript = Get-ScriptName $scripts @("test")

    if ($testScript) {
        $testDefinition = [string]$scripts.$testScript

        if ($testDefinition -match '\bvitest\b') {
            $results += Invoke-Validation `
                -Name "Full test suite" `
                -ScriptName $testScript `
                -Arguments @("--run")
        }
        elseif ($testDefinition -match '\bjest\b') {
            $results += Invoke-Validation `
                -Name "Full test suite" `
                -ScriptName $testScript `
                -Arguments @("--runInBand")
        }
        elseif ($testDefinition -match '\bbun\s+test\b') {
            $results += Invoke-Validation `
                -Name "Full test suite" `
                -ScriptName $testScript `
                -Arguments @() `
                -CommandType "BunTest"
        }
        else {
            $results += Invoke-Validation `
                -Name "Full test suite" `
                -ScriptName $testScript
        }
    }
    else {
        $results += Add-SkippedResult `
            -Name "Full test suite" `
            -Reason "No test script configured in package.json."
    }

    # 4. Production build.
    $buildScript = Get-ScriptName $scripts @("build")

    if ($buildScript) {
        $results += Invoke-Validation `
            -Name "Production build" `
            -ScriptName $buildScript
    }
    else {
        $results += @{
            Name     = "Production build"
            Passed   = $false
            Skipped  = $false
            ExitCode = $null
            Output   = "Required build script is missing from package.json."
        }
    }

    # Determine failures.
    $failed = @(
        $results | Where-Object { -not $_.Passed }
    )

    # Build a detailed report.
    $reportLines = @()

    foreach ($item in $results) {
        if ($item.Skipped) {
            $status = "SKIPPED"
        }
        elseif ($item.Passed) {
            $status = "PASSED"
        }
        else {
            $status = "FAILED"
        }

        $reportLines += "$status : $($item.Name)"

        if (-not $item.Passed) {
            $reportLines += "Exit code: $($item.ExitCode)"
            $reportLines += $item.Output
        }
        elseif ($item.Skipped) {
            $reportLines += $item.Output
        }
    }

    $report = $reportLines -join "`n"

    # Block Claude from finishing when validation fails.
    if ($failed.Count -gt 0) {
        $reason = @"
FRONTEND VALIDATION FAILED.

Do not declare the task complete.

Fix the following validation failures and run the checks again.

$report
"@

        # Keep stdout strictly valid JSON.
        $response = @{
            decision = "block"
            reason   = $reason
        }

        $json = $response | ConvertTo-Json -Compress -Depth 5

        [Console]::Out.WriteLine($json)
        exit 0
    }

    # All required checks passed.
    [Console]::Error.WriteLine(
        "FRONTEND VALIDATION PASSED.`n$report"
    )

    exit 0
}
catch {
    # Fail closed: configuration or hook errors must not be
    # silently treated as successful validation.
    $reason = "FRONTEND VALIDATION HOOK ERROR: $($_.Exception.Message)"

    $response = @{
        decision = "block"
        reason   = $reason
    }

    $json = $response | ConvertTo-Json -Compress -Depth 5

    [Console]::Out.WriteLine($json)
    exit 0
}
