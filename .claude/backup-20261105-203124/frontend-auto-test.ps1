
$ErrorActionPreference = "Stop"

function Write-HookError {
    param([string]$Message)
    [Console]::Error.WriteLine($Message)
}

try {
    # 1. Read Claude Code PostToolUse event.
    $rawInput = [Console]::In.ReadToEnd()

    if ([string]::IsNullOrWhiteSpace($rawInput)) {
        exit 0
    }

    $event = $rawInput | ConvertFrom-Json

    $root = $env:CLAUDE_PROJECT_DIR

    if ([string]::IsNullOrWhiteSpace($root)) {
        $root = $event.cwd
    }

    if (-not $root -or -not (Test-Path -LiteralPath $root)) {
        exit 0
    }

    # 2. Identify the modified file.
    $filePath = $event.tool_input.file_path

    if (-not $filePath) {
        exit 0
    }

    if (-not [IO.Path]::IsPathRooted($filePath)) {
        $filePath = Join-Path $root $filePath
    }

    $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()

    if ($extension -notin @(".ts", ".tsx", ".js", ".jsx")) {
        exit 0
    }

    $fileName = [IO.Path]::GetFileNameWithoutExtension($filePath)

    # 3. Avoid running tests when a test file itself is edited.
    if ($fileName -match '\.(test|spec)$') {
        exit 0
    }

    # 4. Check Bun and package configuration.
    if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
        throw "Bun was not found in PATH."
    }

    $packagePath = Join-Path $root "package.json"

    if (-not (Test-Path -LiteralPath $packagePath)) {
        exit 0
    }

    $package = Get-Content $packagePath -Raw | ConvertFrom-Json

    if (-not $package.scripts.test) {
        Write-Output "AUTO TEST: No test script configured. Skipping."
        exit 0
    }

    # 5. Locate the project's test directory.
    $testDirectory = Join-Path $root "tests"

    if (-not (Test-Path -LiteralPath $testDirectory)) {
        Write-Output "AUTO TEST: tests directory not found. Skipping."
        exit 0
    }

    # 6. Discover all unit test files.
    $allTests = @(
        Get-ChildItem -LiteralPath $testDirectory -Recurse -File |
        Where-Object {
            $_.FullName -notmatch '[\\/](node_modules|\.next|dist|build|\.git|coverage)[\\/]' -and
            $_.Name -match '\.(test|spec)\.(ts|tsx|js|jsx)$'
        }
    )

    if ($allTests.Count -eq 0) {
        Write-Output "AUTO TEST: No unit test files found. Skipping."
        exit 0
    }

    # 7. Normalize source filename for matching.
    # Examples:
    # apiConfig.ts       -> apiConfig
    # blogs.schema.ts    -> blogs.schema
    # blogs.ts           -> blogs
    $sourceName = $fileName.ToLowerInvariant()

    $matchingTests = @(
        $allTests | Where-Object {
            $testName = $_.BaseName

            # Remove .test or .spec suffix.
            $testName = $testName -replace '\.(test|spec)$', ''
            $testName = $testName.ToLowerInvariant()

            # Exact match or schema-style suffix match.
            $testName -eq $sourceName -or
            $testName.StartsWith("$sourceName.") -or
            $sourceName.StartsWith("$testName.")
        }
    )

    if ($matchingTests.Count -eq 0) {
        Write-Output "AUTO TEST: No related test found for $fileName. Skipping targeted tests."
        exit 0
    }

    # 8. Run every matching test using Bun Test.
    Set-Location $root

    Write-Output "AUTO TEST: Found $($matchingTests.Count) related test file(s)."

    $testPaths = @(
        $matchingTests | ForEach-Object {
            $_.FullName
        }
    )

    Write-Output "AUTO TEST: Running Bun unit tests:"
    foreach ($path in $testPaths) {
        Write-Output "  $path"
    }

    $output = & bun test @testPaths 2>&1
    $exitCode = $LASTEXITCODE

    # 9. Capture actual test output.
    $details = ($output | ForEach-Object { "$_" }) -join "`n"

    if ($details.Length -gt 12000) {
        $details = $details.Substring($details.Length - 12000)
    }

    if ($exitCode -ne 0) {
        Write-HookError @"
AUTO TEST FAILED.

Modified file: $fileName
Test files: $($matchingTests.Count)
Exit code: $exitCode

Test output:
$details
"@

        # Send failure feedback to Claude.
        exit 2
    }

    Write-Output @"
AUTO TEST PASSED.
Modified file: $fileName
Test files executed: $($matchingTests.Count)
$details
"@

    exit 0
}
catch {
    Write-HookError "AUTO TEST HOOK ERROR: $($_.Exception.Message)"
    exit 2
}
