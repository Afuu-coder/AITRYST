@echo off
echo Starting AI Artisan Assistant Development Server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
.\nodejs\node.exe .\node_modules\next\dist\bin\next dev
pause
