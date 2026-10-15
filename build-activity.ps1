param([Parameter(Mandatory=$true)][string]$ApplicationId)
$ErrorActionPreference = "Stop"
if ($ApplicationId -notmatch '^\d{17,20}$') { throw "Application ID must contain 17-20 digits." }
Set-Location $PSScriptRoot
$env:VITE_DISCORD_CLIENT_ID = $ApplicationId
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }
Write-Host "Build complete: dist"
