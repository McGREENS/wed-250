# PowerShell Helper Script for Database Copy
# This script makes it easier to configure and run database copy on Windows

param(
    [string]$SourceType = "turso",
    [string]$SourceUrl = $env:TURSO_DATABASE_URL,
    [string]$SourceToken = $env:TURSO_AUTH_TOKEN,
    [string]$DestType = "turso",
    [string]$DestUrl = "",
    [string]$DestToken = "",
    [switch]$Interactive = $false,
    [switch]$Help = $false
)

$ErrorActionPreference = "Stop"

# Colors
$colors = @{
    Reset  = "`e[0m"
    Green  = "`e[32m"
    Yellow = "`e[33m"
    Red    = "`e[31m"
    Blue   = "`e[34m"
    Cyan   = "`e[36m"
}

function Write-Success {
    param([string]$Message)
    Write-Host "$($colors.Green)✓$($colors.Reset) $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "$($colors.Red)✗$($colors.Reset) $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "$($colors.Blue)ℹ$($colors.Reset) $Message" -ForegroundColor Blue
}

function Write-Section {
    param([string]$Message)
    Write-Host ""
    Write-Host "$($colors.Cyan)=== $Message ===$($colors.Reset)" -ForegroundColor Cyan
}

function Show-Help {
    Write-Host @"
Database Copy Helper Script for Windows

USAGE:
    ./copy-database.ps1 [options]

OPTIONS:
    -SourceType <type>      Source database type: "turso" or "sqlite" (default: turso)
    -SourceUrl <url>        Source database URL (default: TURSO_DATABASE_URL env var)
    -SourceToken <token>    Source auth token (default: TURSO_AUTH_TOKEN env var)
    -DestType <type>        Destination database type: "turso" or "sqlite" (default: turso)
    -DestUrl <url>          Destination database URL (required if not turso defaults)
    -DestToken <token>      Destination auth token (if turso destination)
    -Interactive            Interactive mode (prompt for all values)
    -Help                   Show this help message

EXAMPLES:
    # Turso to Turso (uses env vars)
    ./copy-database.ps1

    # Turso to Local SQLite
    ./copy-database.ps1 -DestType sqlite -DestUrl "./backup.db"

    # Interactive mode
    ./copy-database.ps1 -Interactive

    # Local to Turso
    ./copy-database.ps1 -SourceType sqlite -SourceUrl "./local.db" `
                         -DestType turso -DestUrl "libsql://..." -DestToken "..."
"@
}

if ($Help) {
    Show-Help
    exit 0
}

Write-Section "Database Copy Helper"

# Interactive mode
if ($Interactive) {
    Write-Host ""
    Write-Info "=== Interactive Setup ==="
    Write-Host ""

    # Source setup
    Write-Host "--- Source Database ---" -ForegroundColor Cyan
    $sourceType = Read-Host "Source type (turso/sqlite) [turso]"
    if ([string]::IsNullOrWhiteSpace($sourceType)) { $sourceType = "turso" }

    if ($sourceType -eq "turso") {
        $sourceUrl = Read-Host "Source Turso URL [from env]"
        if ([string]::IsNullOrWhiteSpace($sourceUrl)) { $sourceUrl = $env:TURSO_DATABASE_URL }
        $sourceToken = Read-Host "Source auth token [from env]"
        if ([string]::IsNullOrWhiteSpace($sourceToken)) { $sourceToken = $env:TURSO_AUTH_TOKEN }
    }
    else {
        $sourceUrl = Read-Host "Source database file path [./local.db]"
        if ([string]::IsNullOrWhiteSpace($sourceUrl)) { $sourceUrl = "./local.db" }
    }

    # Destination setup
    Write-Host ""
    Write-Host "--- Destination Database ---" -ForegroundColor Cyan
    $destType = Read-Host "Destination type (turso/sqlite) [turso]"
    if ([string]::IsNullOrWhiteSpace($destType)) { $destType = "turso" }

    if ($destType -eq "turso") {
        $destUrl = Read-Host "Destination Turso URL"
        $destToken = Read-Host "Destination auth token"
    }
    else {
        $destUrl = Read-Host "Destination database file path [./backup.db]"
        if ([string]::IsNullOrWhiteSpace($destUrl)) { $destUrl = "./backup.db" }
    }

    $SourceType = $sourceType
    $SourceUrl = $sourceUrl
    $SourceToken = $sourceToken
    $DestType = $destType
    $DestUrl = $destUrl
    $DestToken = $destToken
}

# Validate inputs
if ([string]::IsNullOrWhiteSpace($SourceUrl)) {
    Write-Error "Source URL not provided. Use -SourceUrl or set TURSO_DATABASE_URL env var"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($DestUrl)) {
    Write-Error "Destination URL not provided. Use -DestUrl"
    exit 1
}

if ($SourceType -eq "turso" -and [string]::IsNullOrWhiteSpace($SourceToken)) {
    Write-Error "Source token required for Turso. Use -SourceToken or set TURSO_AUTH_TOKEN env var"
    exit 1
}

if ($DestType -eq "turso" -and [string]::IsNullOrWhiteSpace($DestToken)) {
    Write-Error "Destination token required for Turso. Use -DestToken"
    exit 1
}

# Display configuration
Write-Section "Configuration"
Write-Host ""
Write-Host "Source Database:"
Write-Host "  Type: $SourceType"
Write-Host "  URL:  $($SourceUrl.Substring(0, [Math]::Min(50, $SourceUrl.Length)))"
if ($SourceType -eq "turso") {
    Write-Host "  Token: $(if ($SourceToken.Length -gt 10) { $SourceToken.Substring(0, 10) + '...' } else { '[provided]' })"
}

Write-Host ""
Write-Host "Destination Database:"
Write-Host "  Type: $DestType"
Write-Host "  URL:  $($DestUrl.Substring(0, [Math]::Min(50, $DestUrl.Length)))"
if ($DestType -eq "turso") {
    Write-Host "  Token: $(if ($DestToken.Length -gt 10) { $DestToken.Substring(0, 10) + '...' } else { '[provided]' })"
}

Write-Host ""
Write-Host "⚠️  WARNING: This will replace all data in the destination database" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continue with copy? (yes/no)"

if ($confirm -ne "yes" -and $confirm -ne "y") {
    Write-Info "Copy cancelled"
    exit 0
}

# Set environment variables
Write-Info "Setting up environment variables..."
$env:SOURCE_DB_TYPE = $SourceType
$env:SOURCE_URL = $SourceUrl
$env:SOURCE_TOKEN = $SourceToken
$env:DEST_DB_TYPE = $DestType
$env:DEST_DATABASE_URL = $DestUrl
$env:DEST_AUTH_TOKEN = $DestToken

# Also set Turso defaults if source is turso
if ($SourceType -eq "turso") {
    $env:TURSO_DATABASE_URL = $SourceUrl
    $env:TURSO_AUTH_TOKEN = $SourceToken
}

# Run the copy script
Write-Section "Running Database Copy"
Write-Host ""

try {
    & node copy-database.mjs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database copy completed successfully!"
        
        if (Test-Path "./database-copy-report.json") {
            Write-Success "Report saved to database-copy-report.json"
            Write-Host ""
            Write-Host "Report Contents:" -ForegroundColor Cyan
            Get-Content ./database-copy-report.json | ConvertFrom-Json | Format-Table -AutoSize
        }
    }
    else {
        Write-Error "Database copy failed with exit code $LASTEXITCODE"
        exit 1
    }
}
catch {
    Write-Error "Error running copy script: $_"
    exit 1
}
