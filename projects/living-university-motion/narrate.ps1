param([Parameter(Mandatory=$true)][string]$Ffmpeg)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$story=Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'assets/story-data.json') | ConvertFrom-Json
$speaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft David Desktop')
$speaker.Rate=0
$format=New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000,[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,[System.Speech.AudioFormat.AudioChannel]::Mono)
$timings=@()
foreach($scene in $story.scenes){
 $wave=Join-Path $PSScriptRoot ('assets/'+$scene.id+'.wav')
 $mp3=Join-Path $PSScriptRoot ('assets/'+$scene.id+'.mp3')
 $speaker.SetOutputToWaveFile($wave,$format)
 $speaker.Speak($scene.text)
 $speaker.SetOutputToNull()
 $duration=([System.IO.FileInfo]$wave).Length/48000.0-.001
 & $Ffmpeg -hide_banner -loglevel error -y -i $wave -codec:a libmp3lame -b:a 96k $mp3
 if($LASTEXITCODE -ne 0){throw 'Audio encoding failed'}
 $timings+=@{id=$scene.id;duration=[math]::Round($duration,3)}
 Write-Output ($scene.id+': '+[math]::Round($duration,1)+'s')
}
$timings | ConvertTo-Json | Set-Content -Encoding UTF8 (Join-Path $PSScriptRoot 'assets/narration-timing.json')
$speaker.Dispose()
