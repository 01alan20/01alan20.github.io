param([string]$Quality='draft',[string]$Output='out/living-university-draft.mp4')
$ErrorActionPreference='Stop'
$motionTools=Join-Path $env:TEMP 'living-motion-tools'
if(Test-Path -LiteralPath (Join-Path $motionTools 'ffmpeg.exe')){$env:PATH=$motionTools+';'+$env:PATH}
if(-not(Get-Command ffmpeg -ErrorAction SilentlyContinue)-or -not(Get-Command ffprobe -ErrorAction SilentlyContinue)){throw 'FFmpeg and FFprobe are required. Add their bin directory to PATH, then rerun.'}
Push-Location (Join-Path $PSScriptRoot 'video')
try{& npx --yes hyperframes@0.8.146 render --quality $Quality --fps 24 --output $Output;if($LASTEXITCODE -ne 0){throw 'Render failed'}}finally{Pop-Location}
