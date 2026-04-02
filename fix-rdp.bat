@echo off
echo ========================================
echo Restarting RDP Service...
echo ========================================
echo.

echo Stopping Remote Desktop Services...
net stop TermService /y
timeout /t 2 /nobreak >nul

echo Starting Remote Desktop Services...
net start TermService

echo.
echo ========================================
echo RDP Service Restarted!
echo Try connecting now.
echo ========================================
echo.
echo Current service status:
sc query TermService
echo.
pause
