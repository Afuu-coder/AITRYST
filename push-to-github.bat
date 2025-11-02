@echo off
echo ========================================
echo  AITRYST - Push to GitHub
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Git not found! Please restart your terminal.
    pause
    exit /b 1
)
echo ✓ Git initialized
echo.

echo Step 2: Adding all files...
git add .
echo ✓ Files added
echo.

echo Step 3: Creating initial commit...
git commit -m "Initial commit: AITRYST - AI-Powered Artisan Platform - Complete Next.js 14 application with 10+ studio tools, AI integration, QR Microsite generator, Dashboard analytics, 22 API endpoints, Full documentation, Production-ready deployment"
echo ✓ Commit created
echo.

echo Step 4: Adding remote repository...
git remote add origin https://github.com/Afuu-coder/AITRYSTT.git
echo ✓ Remote added
echo.

echo Step 5: Renaming branch to main...
git branch -M main
echo ✓ Branch renamed
echo.

echo Step 6: Pushing to GitHub...
echo.
echo You will be prompted for credentials:
echo - Username: Your GitHub username
echo - Password: Your Personal Access Token (NOT your password)
echo.
git push -u origin main
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo  Push Failed!
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Authentication failed - Use Personal Access Token
    echo 2. Repository already exists - Try: git push -f origin main
    echo 3. Network issues - Check your internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! 🎉
echo ========================================
echo.
echo Your code has been pushed to GitHub!
echo.
echo Repository: https://github.com/Afuu-coder/AITRYSTT
echo Live App: https://aitrystt-nine.vercel.app
echo.
echo Next steps:
echo 1. Visit your GitHub repository
echo 2. Add description and topics
echo 3. Verify README displays correctly
echo.
pause
