@echo off
echo ========================================
echo RDP Diagnostic Script
echo ========================================
echo.

echo [1] Checking Remote Desktop Service...
sc query termservice
echo.

echo [2] Checking if port 3389 is listening...
netstat -an | findstr :3389
echo.

echo [3] Checking firewall rules for RDP...
netsh advfirewall firewall show rule name=all | findstr /i "remote desktop"
echo.

echo [4] Checking RDP registry settings...
reg query "HKLM\System\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections
reg query "HKLM\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication
echo.

echo [5] Checking Event Viewer for RDP errors...
wevtutil qe System /q:"*[System[Provider[@Name='Microsoft-Windows-TerminalServices-RemoteConnectionManager']]]" /c:5 /rd:true /f:text
echo.

echo ========================================
echo Diagnostic complete!
echo ========================================
pause
