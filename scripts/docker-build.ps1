#Requires -Version 5.1
<#
.SYNOPSIS
    Builds the myportfolio-frontend Docker image.

.DESCRIPTION
    Reads the four required NEXT_PUBLIC_* variables from .env.production
    and passes them to docker build via --build-arg. Never prints the actual
    values. Does not modify or copy .env.production.

.NOTES
    The four variables are NEXT_PUBLIC_* values and are intentionally exposed
    to the browser by Next.js. They are NOT server secrets.
    Server-only secrets or environment configs (e.g., INTERNAL_API_BASE_URL)
    are NOT passed at build time; they can be supplied at container runtime (`docker run -e`).
#>

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir
$EnvFile   = Join-Path $RepoRoot ".env.production"
$ImageName = "myportfolio-frontend:latest"

# ---------------------------------------------------------------------------
# 1. Validate that .env.production exists
# ---------------------------------------------------------------------------
if (-not (Test-Path $EnvFile)) {
    Write-Error "ERROR: $EnvFile not found. Cannot build Docker image without environment configuration."
    exit 1
}

# ---------------------------------------------------------------------------
# 2. Parse .env.production into a hashtable (key -> value)
# ---------------------------------------------------------------------------
$envMap = @{}
Get-Content -Path $EnvFile | ForEach-Object {
    $line = $_.Trim()
    # Skip blank lines and comments
    if ([string]::IsNullOrEmpty($line) -or $line.StartsWith("#")) {
        return
    }
    # Split only on the FIRST '=' so values may contain '='
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $key   = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    # Strip surrounding quotes if present
    if ($value.Length -ge 2 -and
        (($value.StartsWith('"') -and $value.EndsWith('"')) -or
         ($value.StartsWith("'") -and $value.EndsWith("'")))) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    $envMap[$key] = $value
}

# ---------------------------------------------------------------------------
# 3. Required variables for the build
# ---------------------------------------------------------------------------
$requiredVars = @(
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_FRONTEND_BASE_URL",
    "NEXT_PUBLIC_IMAGEBB_API_KEY",
    "NEXT_PUBLIC_IMAGEBB_API_LINK"
)

$missing = @()
foreach ($var in $requiredVars) {
    if (-not $envMap.ContainsKey($var) -or [string]::IsNullOrEmpty($envMap[$var])) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Error "ERROR: The following required variables are missing or empty in $EnvFile :"
    $missing | ForEach-Object { Write-Error "  - $_" }
    exit 1
}

# ---------------------------------------------------------------------------
# 4. Build the docker command with --build-arg for each variable
# ---------------------------------------------------------------------------
$buildArgs = @()
foreach ($var in $requiredVars) {
    $buildArgs += "--build-arg"
    $buildArgs += "$var=$($envMap[$var])"
}

Write-Host "Building Docker image: $ImageName"
Write-Host "Using environment file: $EnvFile"

# Run docker build from the repository root
Push-Location $RepoRoot
try {
    docker build @buildArgs -t $ImageName .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Docker build failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
    Write-Host "Docker build succeeded."
}
finally {
    Pop-Location
}
