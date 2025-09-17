=Get-Date; npm test --silent; =New-TimeSpan -Start  -End (Get-Date); Write-Host (\ TotalTestRuntimeMs=\ + [math]::Round(.TotalMilliseconds))
