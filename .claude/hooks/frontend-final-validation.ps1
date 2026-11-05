
<#
.SYNOPSIS
    Coordinates final frontend validation, browser QA, and error feedback
    before Claude Code is allowed to finish a development task.

.DESCRIPTION
    This script is designed to work as a Claude Code Stop hook for
    Next.js, React, and other supported frontend projects.

    It coordinates three main validation stages:

    1. CODE VALIDATION
       - Runs the project's automated test suite.
       - Runs ESLint.
       - Runs the production build.
       - Collects failed checks and relevant error output.

    2. DEVELOPMENT SERVER MANAGEMENT
       - Searches for an accessible development server belonging
         to the current project.
       - Reuses the existing project server when it is usable.
       - Does not terminate servers belonging to other projects.
       - Starts a separate QA server on an available TCP port when
         an existing project server cannot be reused.
       - Records the QA server process ID, port, and log locations.
       - Captures terminal output when the QA hook starts the server.

    3. PLAYWRIGHT BROWSER QA
       - Opens the frontend using Playwright CLI.
       - Captures a browser page snapshot.
       - Inspects browser console errors.
       - Inspects network requests and possible HTTP failures.
       - Captures screenshots when supported.
       - Collects browser and development server error information.

.AUTOMATIC REPAIR FEEDBACK
    When validation fails:

    1. Saves the current validation state.
    2. Returns a Stop-hook block response to Claude Code.
    3. Provides the actual error output and affected validation stage.
    4. Instructs Claude to investigate the root cause.
    5. Requests appropriate code changes and verification.
    6. Retains the browser session and QA-owned server for investigation.

    Claude performs the actual code investigation and repairs.
    The PowerShell script itself does not modify application source code.

.SESSION MANAGEMENT
    Stores session-specific validation information inside:

        .claude/hook-state/

    Tracks validation phases, failed checks, browser session details,
    development server information, and QA log locations.

    This allows validation to continue across Stop-hook interventions.

.SERVER SAFETY
    - Reuses an accessible server only when its process can be associated
      with the current project.
    - Does not intentionally terminate unrelated development servers.
    - Uses a free TCP port when starting its own QA server.
    - Stops only the QA-owned server after successful completion.
    - Does not intentionally stop a manually managed project server.

.API AND DATA SAFETY
    Browser inspection does not automatically authorize data-changing
    operations.

    Do not submit forms, create or modify records, send messages,
    upload files, make payments, or perform destructive operations
    without explicit user approval and a verified test environment.

    Do not hide backend failures by making incorrect frontend changes.

.CLEANUP
    After successful validation:

    - Closes the QA-owned Playwright browser session.
    - Stops the QA-owned development server.
    - Removes the current session's temporary hook state and markers.
    - Preserves unrelated sessions and manually managed servers.

.ERROR HANDLING
    Returns a Stop-hook block response when validation fails or an
    unexpected hook error occurs.

    Claude Code controls the maximum number of consecutive Stop-hook
    continuations. This script cannot override that platform limit.

.REQUIREMENTS
    - Windows PowerShell
    - Bun installed and available in PATH
    - A compatible frontend project with test, lint, and build scripts
    - Playwright CLI installed and available in PATH
    - Playwright browser installed
    - Claude Code hooks configured
    - Appropriate permissions for process and TCP port inspection

.REUSE
    Can be adapted for other Next.js, React, and JavaScript frontend
    projects.

    Review the following project-specific settings before reuse:

    - Package manager and validation commands.
    - Development server startup command.
    - Framework-specific server detection.
    - Browser CLI commands and session behavior.
    - Development server log handling.
    - Project-specific environment configuration.

.LIMITATIONS
    Browser smoke checks do not guarantee complete functional or visual QA.

    Existing manually started server logs may not be accessible to this
    hook. Backend failures must be distinguished from frontend defects.

    Browser interactions and data-changing workflows require explicit
    safety rules and a suitable test environment.

.NOTES
    This hook coordinates validation and reports failures.
    Claude is responsible for diagnosing and repairing application code.
#>



$ErrorActionPreference = "Stop"

# ============================================================
# CONFIGURATION
# ============================================================

$MaxBrowserStartupSeconds = 45
$MaxServerStartupSeconds = 60
$MaxErrorLength = 10000

# ============================================================
# GENERAL HELPERS
# ============================================================

function Write-StopResponse {
    param([string]$Reason)

    $response = @{
        decision = "block"
        reason = $Reason
    }

    [Console]::Out.WriteLine(
        ($response | ConvertTo-Json -Compress -Depth 10)
    )
}

function Get-SafeSessionId {
    param([string]$SessionId)

    if ([string]::IsNullOrWhiteSpace($SessionId)) {
        return "unknown-session"
    }

    return ($SessionId -replace '[^a-zA-Z0-9_-]', '_')
}

function Get-StateDirectory {
    param([string]$Root)

    $directory = Join-Path $Root ".claude\hook-state"

    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force |
            Out-Null
    }

    return $directory
}

function Get-StatePath {
    param(
        [string]$Root,
        [string]$SessionId
    )

    $safeId = Get-SafeSessionId $SessionId
    $directory = Get-StateDirectory $Root

    return Join-Path $directory "$safeId.json"
}

function Read-State {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return $null
    }

    try {
        return Get-Content -LiteralPath $Path -Raw |
            ConvertFrom-Json
    }
    catch {
        return $null
    }
}

function Save-State {
    param(
        [string]$Path,
        [object]$State
    )

    $State |
        ConvertTo-Json -Depth 15 |
        Set-Content -LiteralPath $Path -Encoding UTF8
}

function Limit-Text {
    param(
        [string]$Text,
        [int]$Limit = 10000
    )

    if ($null -eq $Text) {
        return ""
    }

    if ($Text.Length -gt $Limit) {
        return $Text.Substring($Text.Length - $Limit)
    }

    return $Text
}

# ============================================================
# PROJECT SERVER DISCOVERY
# ============================================================

function Test-HttpServer {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest `
            -Uri $Url `
            -Method GET `
            -TimeoutSec 4 `
            -MaximumRedirection 3 `
            -UseBasicParsing `
            -ErrorAction Stop

        return ($response.StatusCode -ge 200 -and
                $response.StatusCode -lt 500)
    }
    catch {
        # A responding application may return 401, 403, or 404.
        if ($_.Exception.Response) {
            return $true
        }

        return $false
    }
}

function Find-ProjectDevelopmentServer {
    param([string]$ProjectRoot)

    $root = [IO.Path]::GetFullPath($ProjectRoot).TrimEnd('\')
    $processes = Get-CimInstance Win32_Process

    $listeners = @(
        Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
        Where-Object {
            $_.LocalPort -ge 1024 -and
            $_.LocalAddress -in @("127.0.0.1", "0.0.0.0", "::", "::1")
        } |
        Sort-Object -Property LocalPort -Unique
    )

    foreach ($listener in $listeners) {
        $process = $processes |
            Where-Object {
                $_.ProcessId -eq $listener.OwningProcess
            } |
            Select-Object -First 1

        if (-not $process) {
            continue
        }

        $commandLine = [string]$process.CommandLine

        # Only reuse a process whose command line identifies this project.
        # Never guess based on port number alone.
        if ($commandLine.IndexOf(
            $root,
            [StringComparison]::OrdinalIgnoreCase
        ) -lt 0) {
            continue
        }

        if ($commandLine -notmatch 'next(\.js)?|next dev|next-server') {
            continue
        }

        $url = "http://127.0.0.1:$($listener.LocalPort)"

        if (Test-HttpServer -Url $url) {
            return @{
                Url = $url
                Port = [int]$listener.LocalPort
                Pid = [int]$listener.OwningProcess
                Owned = $false
            }
        }
    }

    return $null
}

# ============================================================
# SAFE FREE PORT SELECTION
# ============================================================

function Get-FreeTcpPort {
    $listener = [Net.Sockets.TcpListener]::new(
        [Net.IPAddress]::Loopback,
        0
    )

    try {
        $listener.Start()
        return ([Net.IPEndPoint]$listener.LocalEndpoint).Port
    }
    finally {
        $listener.Stop()
    }
}

# ============================================================
# QA SERVER MANAGEMENT
# ============================================================

function Start-QAServer {
    param(
        [string]$ProjectRoot,
        [string]$StateDirectory
    )

    $bun = Get-Command bun -ErrorAction SilentlyContinue

    if (-not $bun) {
        throw "Bun is not available in PATH."
    }

    $stdoutPath = Join-Path $StateDirectory "qa-server-stdout.log"
    $stderrPath = Join-Path $StateDirectory "qa-server-stderr.log"

    for ($attempt = 1; $attempt -le 5; $attempt++) {
        $port = Get-FreeTcpPort

        Write-Host "Starting QA server on port $port..." `
            -ForegroundColor Cyan

        Remove-Item $stdoutPath, $stderrPath `
            -Force -ErrorAction SilentlyContinue

        $process = Start-Process `
            -FilePath $bun.Source `
            -ArgumentList @(
                "run",
                "dev",
                "--",
                "--hostname",
                "127.0.0.1",
                "--port",
                "$port"
            ) `
            -WorkingDirectory $ProjectRoot `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath `
            -PassThru

        $deadline = (Get-Date).AddSeconds($MaxServerStartupSeconds)

        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Milliseconds 1000

            if ($process.HasExited) {
                break
            }

            if (Test-HttpServer -Url "http://127.0.0.1:$port") {
                return @{
                    Url = "http://127.0.0.1:$port"
                    Port = $port
                    Pid = $process.Id
                    Owned = $true
                    Stdout = $stdoutPath
                    Stderr = $stderrPath
                }
            }
        }

        if (-not $process.HasExited) {
            # Stop only the process created by this function.
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }

        if (Test-Path $stderrPath) {
            Write-Host (Get-Content $stderrPath -Raw) -ForegroundColor Red
        }

        Write-Host "QA server startup failed on port $port." `
            -ForegroundColor Yellow
    }

    throw "Could not start the QA development server on an available port."
}

function Stop-OwnedQAServer {
    param([object]$Server)

    if (-not $Server -or -not $Server.Owned) {
        return
    }

    $pidToStop = [int]$Server.Pid

    if ($pidToStop -le 0) {
        return
    }

    $process = Get-CimInstance Win32_Process |
        Where-Object { $_.ProcessId -eq $pidToStop } |
        Select-Object -First 1

    if (-not $process) {
        return
    }

    # Verify this is still the process we launched.
    if ($process.CommandLine -match 'bun.*run.*dev|next.*dev') {
        Stop-Process -Id $pidToStop -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped QA-owned server PID $pidToStop." `
            -ForegroundColor Green
    }
}

function Get-ServerLogs {
    param([object]$Server)

    if (-not $Server -or -not $Server.Owned) {
        return "Existing project server reused. Its terminal output is not directly accessible to this hook."
    }

    $logs = @()

    foreach ($path in @($Server.Stdout, $Server.Stderr)) {
        if (Test-Path -LiteralPath $path) {
            $content = Get-Content -LiteralPath $path -Raw

            if (-not [string]::IsNullOrWhiteSpace($content)) {
                $logs += "FILE: $path`n$content"
            }
        }
    }

    return ($logs -join "`n")
}

# ============================================================
# PLAYWRIGHT CLI
# ============================================================

function Invoke-PlaywrightCLI {
    param(
        [string[]]$Arguments,
        [int]$TimeoutSeconds = 30
    )

    $cli = Get-Command playwright-cli -ErrorAction SilentlyContinue

    if (-not $cli) {
        throw "playwright-cli was not found in PATH."
    }

    $output = & $cli.Source @Arguments 2>&1
    $exitCode = $LASTEXITCODE

    $text = ($output | ForEach-Object { "$_" }) -join "`n"

    return @{
        ExitCode = $exitCode
        Output = $text
    }
}

function Invoke-BrowserQA {
    param(
        [string]$Url,
        [string]$SessionName
    )

    $errors = @()
    $sessionPrefix = "-s=$SessionName"

    Write-Host "Starting Playwright browser QA..." -ForegroundColor Cyan
    Write-Host "Target: $Url"

    # Open the browser or navigate an existing QA session.
    $openResult = Invoke-PlaywrightCLI -Arguments @(
        $sessionPrefix,
        "open",
        $Url
    )

    if ($openResult.ExitCode -ne 0) {
        $gotoResult = Invoke-PlaywrightCLI -Arguments @(
            $sessionPrefix,
            "goto",
            $Url
        )

        if ($gotoResult.ExitCode -ne 0) {
            $errors += "Could not open the application in Playwright.`n$($openResult.Output)`n$($gotoResult.Output)"
            return $errors
        }
    }

    # Capture the rendered page.
    $snapshot = Invoke-PlaywrightCLI -Arguments @(
        $sessionPrefix,
        "snapshot"
    )

    if ($snapshot.ExitCode -ne 0) {
        $errors += "Browser snapshot failed:`n$($snapshot.Output)"
    }

    # Capture browser console errors.
    $console = Invoke-PlaywrightCLI -Arguments @(
        $sessionPrefix,
        "console",
        "error"
    )

    if ($console.ExitCode -ne 0) {
        $errors += "Browser console inspection failed:`n$($console.Output)"
    }
    elseif ($console.Output -match '(?i)(uncaught|unhandled|TypeError|ReferenceError|SyntaxError|Hydration failed|Maximum update depth|Failed to fetch|net::ERR_)') {
        $errors += "Browser console reports possible runtime errors:`n$($console.Output)"
    }

    # Inspect network requests.
    $requests = Invoke-PlaywrightCLI -Arguments @(
        $sessionPrefix,
        "requests"
    )

    if ($requests.ExitCode -ne 0) {
        $errors += "Network inspection failed:`n$($requests.Output)"
    }
    elseif ($requests.Output -match '(?i)(net::ERR_|ERR_CONNECTION|status[=: ]+5\d\d|HTTP[/ ]+5\d\d|failed.*request)') {
        $errors += "Possible failed network requests:`n$($requests.Output)"
    }

    # Capture page screenshot for visual investigation.
    $screenshot = Invoke-PlaywrightCLI -Arguments @(
        $sessionPrefix,
        "screenshot",
        "--filename=.claude/hook-state/browser-qa.png"
    )

    if ($screenshot.ExitCode -ne 0) {
        Write-Host "Screenshot capture was unavailable." -ForegroundColor Yellow
    }

    return $errors
}

# ============================================================
# FINAL CLEANUP
# ============================================================

function Complete-QASession {
    param(
        [string]$Root,
        [string]$SessionId,
        [object]$State
    )

    $safeId = Get-SafeSessionId $SessionId

    # Close only this QA browser session.
    if ($State -and $State.browser_session) {
        $null = Invoke-PlaywrightCLI -Arguments @(
            "-s=$($State.browser_session)",
            "close"
        )
    }

    # Stop only a QA-owned development server.
    if ($State -and $State.server_owned -eq $true) {
        Stop-OwnedQAServer -Server @{
            Pid = $State.server_pid
            Owned = $true
        }
    }

    $directory = Join-Path $Root ".claude\hook-state"

    if (Test-Path -LiteralPath $directory) {
        $files = @(
            Get-ChildItem -LiteralPath $directory -File |
            Where-Object {
                $_.Name -eq "$safeId.json" -or
                $_.Name -like "$safeId-*.json" -or
                $_.Name -like "$safeId-*"
            }
        )

        foreach ($file in $files) {
            Remove-Item -LiteralPath $file.FullName -Force `
                -ErrorAction SilentlyContinue
        }

        $remaining = @(Get-ChildItem -LiteralPath $directory -Force)

        if ($remaining.Count -eq 0) {
            Remove-Item -LiteralPath $directory -Force `
                -ErrorAction SilentlyContinue
        }
    }
}

# ============================================================
# MAIN STOP HOOK
# ============================================================

try {
    $rawInput = [Console]::In.ReadToEnd()

    if ([string]::IsNullOrWhiteSpace($rawInput)) {
        exit 0
    }

    $event = $rawInput | ConvertFrom-Json

    $projectRoot = $env:CLAUDE_PROJECT_DIR

    if ([string]::IsNullOrWhiteSpace($projectRoot)) {
        $projectRoot = $event.cwd
    }

    if (-not (Test-Path -LiteralPath $projectRoot -PathType Container)) {
        throw "Project directory does not exist."
    }

    Set-Location $projectRoot

    $sessionId = [string]$event.session_id
    $safeId = Get-SafeSessionId $sessionId

    $statePath = Get-StatePath `
        -Root $projectRoot `
        -SessionId $sessionId

    $state = Read-State -Path $statePath

    $definitions = @{
        tests = @("bun", @("test"))
        lint = @("bun", @("run", "lint"))
        build = @("bun", @("run", "build"))
    }

    $allChecks = @("tests", "lint", "build")

    # Initial execution or missing state.
    if ($event.stop_hook_active -ne $true -or $null -eq $state) {
        $phase = "initial"
        $attempt = 1
        $checksToRun = $allChecks
    }
    else {
        $phase = $state.phase
        $attempt = [int]$state.attempt + 1

        if ($phase -eq "confirm") {
            $checksToRun = $allChecks
        }
        else {
            $checksToRun = @($state.failed_checks)

            if ($checksToRun.Count -eq 0) {
                $checksToRun = $allChecks
            }
        }
    }

    $failedChecks = @()
    $failureDetails = @()

    # Run tests, lint, and build.
    foreach ($check in $checksToRun) {
        $definition = $definitions[$check]
        $command = $definition[0]
        $arguments = $definition[1]

        Write-Host "Running $check..." -ForegroundColor Cyan

        $output = & $command @arguments 2>&1
        $exitCode = $LASTEXITCODE

        if ($exitCode -ne 0) {
            $failedChecks += $check

            $details = ($output | ForEach-Object { "$_" }) -join "`n"
            $failureDetails += "[$check] FAILED`n$(Limit-Text $details 8000)"
        }
        else {
            Write-Host "$check passed." -ForegroundColor Green
        }
    }

    # If code validation fails, ask Claude to repair first.
    if ($failedChecks.Count -gt 0) {
        $newState = @{
            attempt = $attempt
            phase = "repair"
            failed_checks = $failedChecks
            browser_session = if ($state) { $state.browser_session } else { $null }
            server_url = if ($state) { $state.server_url } else { $null }
            server_pid = if ($state) { $state.server_pid } else { $null }
            server_owned = if ($state) { $state.server_owned } else { $false }
        }

        Save-State -Path $statePath -State $newState

        $reason = @"
FRONTEND VALIDATION FAILED.

Do not stop or report the task as complete.

Investigate the following failures, fix the actual root causes, and run the checks again.

Failed checks:
$($failedChecks -join ', ')

$($failureDetails -join "`n`n")

Do not disable tests, TypeScript checks, ESLint rules, or build validation to hide failures.
"@

        Write-StopResponse -Reason $reason
        exit 0
    }

    # Start or reuse a project development server.
    $server = $null

    if ($state -and $state.server_url) {
        $existingUrl = [string]$state.server_url

        if (Test-HttpServer -Url $existingUrl) {
            $server = @{
                Url = $existingUrl
                Port = [int]$state.server_port
                Pid = [int]$state.server_pid
                Owned = [bool]$state.server_owned
                Stdout = $state.server_stdout
                Stderr = $state.server_stderr
            }
        }
    }

    if (-not $server) {
        $server = Find-ProjectDevelopmentServer -ProjectRoot $projectRoot
    }

    if (-not $server) {
        $server = Start-QAServer `
            -ProjectRoot $projectRoot `
            -StateDirectory (Get-StateDirectory $projectRoot)
    }

    # Stable browser session for this Claude session.
    $browserSession = "$safeId-qa"

    $newState = @{
        attempt = $attempt
        phase = "browser"
        failed_checks = @()
        browser_session = $browserSession
        server_url = $server.Url
        server_port = $server.Port
        server_pid = $server.Pid
        server_owned = $server.Owned
        server_stdout = $server.Stdout
        server_stderr = $server.Stderr
    }

    Save-State -Path $statePath -State $newState

    # Run browser QA.
    $browserErrors = @(
        Invoke-BrowserQA `
            -Url $server.Url `
            -SessionName $browserSession
    )

    # Read server logs when the QA workflow owns the server.
    $serverLogs = Get-ServerLogs -Server $server

    if ($server.Owned -and
        $serverLogs -match '(?i)(uncaught exception|unhandled exception|Module not found|Failed to compile|SyntaxError|ReferenceError)') {
        $browserErrors += "Development server reported possible runtime errors:`n$(Limit-Text $serverLogs 8000)"
    }

    # Browser failures require Claude to investigate and repair.
    if ($browserErrors.Count -gt 0) {
        $newState.phase = "browser-repair"
        $newState.failed_checks = @("browser")

        Save-State -Path $statePath -State $newState

        $reason = @"
PLAYWRIGHT BROWSER QA FAILED.

Do not stop or report the task as complete.

The application was opened at:
$($server.Url)

Investigate these browser failures:

$($browserErrors -join "`n`n")

Your tasks:
1. Inspect the actual browser errors.
2. Use Playwright MCP to investigate the affected page.
3. Determine whether the cause is frontend, backend, or infrastructure.
4. Fix frontend-related problems.
5. Do not hide backend failures by changing frontend behavior incorrectly.
6. Do not perform unauthorized data-changing operations.
7. Reload the browser and verify your fixes.
8. Continue until the browser checks pass.

Development server logs:
$serverLogs

The Playwright browser session is still available for investigation.
"@

        Write-StopResponse -Reason $reason
        exit 0
    }

    # Browser passed. If this was a repair cycle, run a final full check.
    if ($phase -eq "browser-repair") {
        $newState.phase = "confirm"
        $newState.failed_checks = $allChecks

        Save-State -Path $statePath -State $newState

        Write-StopResponse -Reason @"
Browser QA passed.

Run the complete final validation again:
- bun test
- bun run lint
- bun run build

Do not make unnecessary changes. Allow the final validation to complete.
"@
        exit 0
    }

    # All checks passed. Clean only QA-owned resources.
    Complete-QASession `
        -Root $projectRoot `
        -SessionId $sessionId `
        -State $newState

    Write-Host "All frontend validation and browser QA checks passed." `
        -ForegroundColor Green

    exit 0
}
catch {
    $message = $_.Exception.Message

    [Console]::Error.WriteLine(
        "FRONTEND QA HOOK ERROR: $message"
    )

    Write-StopResponse -Reason @"
The frontend validation hook encountered an unexpected error:

$message

Investigate the hook failure. Do not claim browser QA passed.
"@

    exit 0
}
