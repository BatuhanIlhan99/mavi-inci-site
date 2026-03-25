param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$htmlFiles = @(
  'index.html',
  'odalar.html',
  'deneyimler.html',
  'rezervasyon.html',
  'admin.html',
  'room.html',
  'tesis.html',
  'panel-mavi-inci.html',
  'panel-gulplaj.html',
  'panel-villa-ece.html',
  'panel-fastfood.html',
  'panel-pub.html'
)

$jsFiles = @(
  'boot.js',
  'han-data.js',
  'han-shell.js',
  'han-app.js'
)

foreach ($file in $htmlFiles) {
  $path = Join-Path $Root $file
  if (-not (Test-Path $path)) {
    throw "Missing HTML file: $file"
  }

  $content = Get-Content -Path $path -Raw
  if ($content -notmatch '<div id="root"></div>') {
    throw "Missing root container in $file"
  }

  if ($content -notmatch '<script src="./boot.js"></script>') {
    throw "Missing boot.js include in $file"
  }

  $matches = [regex]::Matches($content, '(?:src|href)="\.\/([^"]+)"')
  foreach ($match in $matches) {
    $asset = $match.Groups[1].Value
    $assetPath = Join-Path $Root $asset
    if (-not (Test-Path $assetPath)) {
      throw "Referenced asset missing in ${file}: ${asset}"
    }
  }
}

$cscript = Join-Path $env:WINDIR 'System32\cscript.exe'
$checker = Join-Path $PSScriptRoot 'check-js-syntax.js'
$targets = $jsFiles | ForEach-Object { Join-Path $Root $_ }

& $cscript //nologo $checker @targets
if ($LASTEXITCODE -ne 0) {
  throw 'JavaScript syntax validation failed.'
}

Write-Output 'Local site validation passed.'
