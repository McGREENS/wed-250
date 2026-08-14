# Quick Database Copy Script
# This script uses your existing .env credentials

# Load .env file
$envFile = Get-Content ".env" -Raw
$envLines = $envFile -split "`n" | Where-Object { $_ -match "^TURSO_" }

foreach ($line in $envLines) {
    if ($line -match "^([^=]+)=(.+)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

Write-Host ""
Write-Host "Database Copy Helper - Quick Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "SUCCESS: Current Database Loaded from .env" -ForegroundColor Green
Write-Host ""
Write-Host "Current Database Configuration:" -ForegroundColor Yellow
Write-Host "  Database: $env:TURSO_DATABASE_URL" -ForegroundColor Blue
Write-Host "  Token: $(if ($env:TURSO_AUTH_TOKEN) { $env:TURSO_AUTH_TOKEN.Substring(0, 30) + '...' })" -ForegroundColor Blue
Write-Host ""

Write-Host "Options:" -ForegroundColor Yellow
Write-Host "  1. Copy to NEW Turso Database (Backup)" -ForegroundColor White
Write-Host "  2. Copy to LOCAL SQLite file (Development)" -ForegroundColor White
Write-Host "  3. RESTORE from Backup" -ForegroundColor White
Write-Host "  4. EXIT" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Setup New Turso Database:" -ForegroundColor Cyan
        $destUrl = Read-Host "Destination Turso URL (libsql://...)"
        $destToken = Read-Host "Destination Auth Token"
        
        if ([string]::IsNullOrWhiteSpace($destUrl) -or [string]::IsNullOrWhiteSpace($destToken)) {
            Write-Host "Error: Both URL and token are required" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "WARNING: This will replace all data in destination database" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (yes/no)"
        
        if ($confirm -ne "yes") {
            Write-Host "Cancelled" -ForegroundColor Yellow
            exit 0
        }
        
        $env:SOURCE_DB_TYPE = "turso"
        $env:DEST_DB_TYPE = "turso"
        $env:DEST_DATABASE_URL = $destUrl
        $env:DEST_AUTH_TOKEN = $destToken
        
        Write-Host ""
        Write-Host "Starting copy..." -ForegroundColor Green
        node copy-database.mjs
    }
    
    "2" {
        Write-Host ""
        $localFile = Read-Host "Local file path (default: backup.db)"
        if ([string]::IsNullOrWhiteSpace($localFile)) {
            $localFile = "backup.db"
        }
        
        Write-Host ""
        Write-Host "WARNING: Will create/replace file: $localFile" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (yes/no)"
        
        if ($confirm -ne "yes") {
            Write-Host "Cancelled" -ForegroundColor Yellow
            exit 0
        }
        
        $env:SOURCE_DB_TYPE = "turso"
        $env:DEST_DB_TYPE = "sqlite"
        $env:DEST_DATABASE_URL = $localFile
        
        Write-Host ""
        Write-Host "Starting copy..." -ForegroundColor Green
        node copy-database.mjs
    }
    
    "3" {
        Write-Host ""
        Write-Host "Setup Backup Database:" -ForegroundColor Cyan
        $backupUrl = Read-Host "Backup Turso URL (libsql://...)"
        $backupToken = Read-Host "Backup Auth Token"
        
        if ([string]::IsNullOrWhiteSpace($backupUrl) -or [string]::IsNullOrWhiteSpace($backupToken)) {
            Write-Host "Error: Both URL and token are required" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "DANGER: This will REPLACE your current database" -ForegroundColor Red
        Write-Host "Current Database: $env:TURSO_DATABASE_URL" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (yes/no)"
        
        if ($confirm -ne "yes") {
            Write-Host "Cancelled" -ForegroundColor Yellow
            exit 0
        }
        
        $env:SOURCE_DB_TYPE = "turso"
        $env:TURSO_DATABASE_URL = $backupUrl
        $env:TURSO_AUTH_TOKEN = $backupToken
        
        $env:DEST_DB_TYPE = "turso"
        $env:DEST_DATABASE_URL = "libsql://andiza-laurier.aws-us-east-1.turso.io"
        $env:DEST_AUTH_TOKEN = $env:TURSO_AUTH_TOKEN
        
        Write-Host ""
        Write-Host "Starting restore..." -ForegroundColor Green
        node copy-database.mjs
    }
    
    "4" {
        Write-Host "Goodbye!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host "Invalid option" -ForegroundColor Red
        exit 1
    }
}
