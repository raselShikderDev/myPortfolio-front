

<#
.SYNOPSIS
    Automatically runs relevant frontend tests after source code changes.

.DESCRIPTION
    This script is designed to work as a Claude Code PostToolUse hook.

    Whenever Claude creates or modifies a source file, the script:

    1. Reads the PostToolUse event supplied by Claude Code.
    2. Identifies the modified project file.
    3. Checks whether the file is a supported source file:
       TypeScript, TSX, JavaScript, or JSX.
    4. Ignores test files and unrelated file types.
    5. Discovers test files inside the project's tests directory.
    6. Matches test files against the modified source filename.
    7. Runs only the related tests using Bun.
    8. Reports test failures and relevant error output to Claude.

.SESSION MANAGEMENT
    Uses a session-specific marker to avoid running the same targeted
    tests repeatedly for the same source file within one Claude session.

    If the session ID is unavailable, tests run without deduplication.

.ERROR HANDLING
    Returns exit code 2 when targeted tests fail or the hook encounters
    an unexpected error, providing feedback to Claude.

    Successful execution produces a short confirmation message.

.REQUIREMENTS
    - PowerShell
    - Bun installed and available in PATH
    - package.json with a test script
    - A tests directory containing .test or .spec files

.REUSE
    Can be reused in other JavaScript, React, Next.js, and TypeScript
    projects that use Bun and follow the supported test-file naming
    conventions.

    Adjust the test runner, test directory, and filename matching rules
    when adapting it to a different project.

.NOTES
    This hook performs targeted testing, not complete project validation.
    The final-validation hook is responsible for running the full test suite.
#>



$ErrorActionPreference = "Stop"

function Write-HookError {
    param([string]$Message)
    [Console]::Error.WriteLine($Message)
}

try {
    # Read PostToolUse event.
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

    # Identify the modified source file.
    $filePath = $event.tool_input.file_path

    if ([string]::IsNullOrWhiteSpace($filePath)) {
        exit 0
    }

    if (-not [IO.Path]::IsPathRooted($filePath)) {
        $filePath = Join-Path $root $filePath
    }

    if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
        exit 0
    }

    $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()

    if ($extension -notin @(".ts", ".tsx", ".js", ".jsx")) {
        exit 0
    }

    $fileName = [IO.Path]::GetFileNameWithoutExtension($filePath)

    # Do not trigger tests when editing test files.
    if ($fileName -match '\.(test|spec)$') {
        exit 0
    }

    $packagePath = Join-Path $root "package.json"
    $testDirectory = Join-Path $root "tests"

    if (-not (Test-Path -LiteralPath $packagePath)) {
        exit 0
    }

    $package = Get-Content $packagePath -Raw | ConvertFrom-Json

    if (-not $package.scripts.test) {
        exit 0
    }

    if (-not (Test-Path -LiteralPath $testDirectory)) {
        exit 0
    }

    if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
        throw "Bun was not found in PATH."
    }

    # Discover test files.
    $allTests = @(
        Get-ChildItem -LiteralPath $testDirectory -Recurse -File |
        Where-Object {
            $_.Name -match '\.(test|spec)\.(ts|tsx|js|jsx)$' -and
            $_.FullName -notmatch '[\\/](node_modules|\.next|dist|build|\.git|coverage)[\\/]'
        }
    )

    if ($allTests.Count -eq 0) {
        exit 0
    }

    # Match source filename to test filename.
    $sourceName = $fileName.ToLowerInvariant()

    $matchingTests = @(
        $allTests | Where-Object {
            $testName = $_.BaseName -replace '\.(test|spec)$', ''
            $testName = $testName.ToLowerInvariant()

            $testName -eq $sourceName -or
            $testName.StartsWith("$sourceName.") -or
            $sourceName.StartsWith("$testName.")
        }
    )

    if ($matchingTests.Count -eq 0) {
        exit 0
    }

    # Create session-specific state directory.
    $sessionId = [string]$event.session_id

    # If session ID is unavailable, run normally without deduplication.
    $stateDirectory = Join-Path $root ".claude\hook-state"

    if (-not [string]::IsNullOrWhiteSpace($sessionId)) {
        New-Item -ItemType Directory -Path $stateDirectory -Force |
            Out-Null

        $safeSession = $sessionId -replace '[^a-zA-Z0-9_-]', '_'

        $normalizedPath = [IO.Path]::GetFullPath($filePath).ToLowerInvariant()

        $sha = [Security.Cryptography.SHA256]::Create()

        try {
            $pathBytes = [Text.Encoding]::UTF8.GetBytes($normalizedPath)
            $fileHash = [Convert]::ToHexString(
                $sha.ComputeHash($pathBytes)
            )
        }
        finally {
            $sha.Dispose()
        }

        $marker = Join-Path $stateDirectory "$safeSession-$fileHash.json"

        # Do not run the same targeted test repeatedly in one session.
        if (Test-Path -LiteralPath $marker) {
            exit 0
        }

        # Mark before execution to avoid repeated failure output
        # after every subsequent edit to this source file.
        @{
            source = $normalizedPath
            timestamp = (Get-Date).ToString("o")
            status = "attempted"
        } | ConvertTo-Json | Set-Content -LiteralPath $marker -Encoding UTF8
    }

    Set-Location $root

    $testPaths = @(
        $matchingTests | ForEach-Object {
            $_.FullName
        }
    )

    Write-Output "AUTO TEST: Running $($testPaths.Count) related test file(s) for $fileName."

    $output = & bun test @testPaths 2>&1
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        $details = ($output | ForEach-Object { "$_" }) -join "`n"

        if ($details.Length -gt 6000) {
            $details = $details.Substring($details.Length - 6000)
        }

        Write-HookError @"
AUTO TEST FAILED.

Source: $fileName
Test files: $($matchingTests.Count)
Exit code: $exitCode

$details

Investigate this failure. The final full test suite will run automatically before completion.
"@

        exit 2
    }

    # Keep successful output short.
    Write-Output "AUTO TEST PASSED: $fileName ($($matchingTests.Count) related test file(s))."

    exit 0
}
catch {
    Write-HookError "AUTO TEST HOOK ERROR: $($_.Exception.Message)"
    exit 2
}
