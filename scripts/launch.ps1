# Starts the dashboard (front + local API) and opens it in the default browser.
# Used by the desktop shortcut created with scripts/create-shortcut.ps1.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$Host.UI.RawUI.WindowTitle = 'all - dashboard'

$url = 'http://localhost:5173'

# Already running: just open the page.
try {
  Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 1 | Out-Null
  Start-Process $url
  exit 0
} catch {}

if (-not (Test-Path (Join-Path $root 'node_modules'))) {
  Write-Host 'First launch: installing dependencies...'
  npm install
}

# Open the browser as soon as the dev server answers.
Start-Job -ScriptBlock {
  param($u)
  for ($i = 0; $i -lt 90; $i++) {
    try {
      Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 1 | Out-Null
      Start-Process $u
      return
    } catch { Start-Sleep -Milliseconds 700 }
  }
} -ArgumentList $url | Out-Null

npm run dev
