# Creates scripts/all.ico (golden ring) if missing, then a "all" shortcut on the desktop
# that runs scripts/launch.ps1.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$ico = Join-Path $PSScriptRoot 'all.ico'

function New-RingIcon([string]$path) {
  Add-Type -AssemblyName System.Drawing
  $size = 256
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::Transparent)

  # Rounded dark background
  $bg = New-Object System.Drawing.Drawing2D.GraphicsPath
  $r = 56
  $bg.AddArc(0, 0, $r, $r, 180, 90)
  $bg.AddArc($size - $r, 0, $r, $r, 270, 90)
  $bg.AddArc($size - $r, $size - $r, $r, $r, 0, 90)
  $bg.AddArc(0, $size - $r, $r, $r, 90, 90)
  $bg.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 2, 6, 23))), $bg)

  # Soft glow
  $glow = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glow.AddEllipse(8, 8, $size - 16, $size - 16)
  $pg = New-Object System.Drawing.Drawing2D.PathGradientBrush $glow
  $pg.CenterColor = [System.Drawing.Color]::FromArgb(90, 245, 158, 11)
  $pg.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 245, 158, 11))
  $g.FillPath($pg, $glow)

  # Gold ring
  $rect = New-Object System.Drawing.RectangleF 62, 62, 132, 132
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 253, 230, 138)), ([System.Drawing.Color]::FromArgb(255, 180, 83, 9)), 45
  $pen = New-Object System.Drawing.Pen $grad, 36
  $g.DrawEllipse($pen, 62, 62, 132, 132)

  # Highlight and inner rune dots
  $hi = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(110, 255, 251, 235)), 5
  $g.DrawArc($hi, 62, 62, 132, 132, 200, 70)
  $dots = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(140, 120, 53, 15)), 3
  $dots.DashPattern = @(1.0, 2.2)
  $g.DrawEllipse($dots, 80, 80, 96, 96)
  $g.Dispose()

  # ICO container holding one 256px PNG image
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  $png = $ms.ToArray()
  $out = New-Object System.IO.MemoryStream
  $w = New-Object System.IO.BinaryWriter $out
  $w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
  $w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0)
  $w.Write([UInt16]1); $w.Write([UInt16]32)
  $w.Write([UInt32]$png.Length); $w.Write([UInt32]22)
  $w.Write($png)
  [System.IO.File]::WriteAllBytes($path, $out.ToArray())
  $bmp.Dispose()
}

if (-not (Test-Path $ico)) { New-RingIcon $ico }

$desktop = [Environment]::GetFolderPath('Desktop')
$lnkPath = Join-Path $desktop 'all.lnk'
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut($lnkPath)
$lnk.TargetPath = (Get-Command powershell.exe).Source
$lnk.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + (Join-Path $PSScriptRoot 'launch.ps1') + '"'
$lnk.WorkingDirectory = $root
$lnk.IconLocation = $ico
$lnk.Description = 'Mes projets - dashboard'
$lnk.Save()

Write-Host "Shortcut created: $lnkPath"
