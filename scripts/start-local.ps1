$ErrorActionPreference = 'Stop'
$bellamaRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $bellamaRoot
$bellamaPort = 3036
if (Get-NetTCPConnection -LocalPort $bellamaPort -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "Port $bellamaPort is already in use. Check http://localhost:$bellamaPort before starting another server."
    exit 0
}
New-Item -ItemType Directory -Force (Join-Path $bellamaRoot 'data') | Out-Null
$bellamaNode = (Get-Command node).Source
$bellamaProcess = Start-Process -FilePath $bellamaNode -ArgumentList '--env-file-if-exists=.env', 'server/index.mjs' -WorkingDirectory $bellamaRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $bellamaRoot 'data/server.log') -RedirectStandardError (Join-Path $bellamaRoot 'data/server-error.log') -PassThru
$bellamaProcess.Id | Set-Content -LiteralPath (Join-Path $bellamaRoot 'data/server.pid')
Write-Host "Bellama started. PID: $($bellamaProcess.Id). URL: http://localhost:$bellamaPort"
