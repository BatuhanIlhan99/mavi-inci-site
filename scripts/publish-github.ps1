param(
  [string]$RepoName = 'mavi-inci-site',
  [switch]$Private
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$git = 'C:\Users\batu\Desktop\codex\tools\git\cmd\git.exe'
$gh = 'C:\Users\batu\Desktop\codex\tools\gh\bin\gh.exe'

if (!(Test-Path $git)) {
  throw "Git bulunamadi: $git"
}

if (!(Test-Path $gh)) {
  throw "GitHub CLI bulunamadi: $gh"
}

& $gh auth status | Out-Null

$owner = (& $gh api user --jq .login).Trim()
if (!$owner) {
  throw 'GitHub kullanici bilgisi alinamadi.'
}

$visibility = if ($Private) { '--private' } else { '--public' }
$remote = ''
try {
  $remote = (& $git -C $root remote get-url origin 2>$null)
} catch {
  $remote = ''
}

if (!$remote) {
  & $gh repo create "$owner/$RepoName" $visibility --source $root --remote origin --push
} else {
  & $git -C $root push -u origin main
}

$pagesPayload = Join-Path $env:TEMP 'mavi-inci-pages.json'
@{
  build_type = 'workflow'
  source = @{
    branch = 'main'
    path = '/'
  }
} | ConvertTo-Json -Depth 4 | Set-Content -Path $pagesPayload -Encoding UTF8

try {
  & $gh api "repos/$owner/$RepoName/pages" --method POST --input $pagesPayload | Out-Null
} catch {
  & $gh api "repos/$owner/$RepoName/pages" --method PUT --input $pagesPayload | Out-Null
}

$pagesUrl = "https://$owner.github.io/$RepoName/"
Write-Host ''
Write-Host "Repo URL: https://github.com/$owner/$RepoName"
Write-Host "Pages URL: $pagesUrl"
