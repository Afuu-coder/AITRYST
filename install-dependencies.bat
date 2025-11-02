@echo off
echo Installing dependencies...
cd /d "%~dp0"
npm install
echo.
echo Installation complete!
echo Press any key to exit...
pause >nul
