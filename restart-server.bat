@echo off
echo Stopping existing Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting development server...
cd /d "%~dp0"
npm run dev

pause
