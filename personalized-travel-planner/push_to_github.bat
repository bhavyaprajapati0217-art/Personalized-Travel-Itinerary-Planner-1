@echo off
setlocal
echo ===================================================================
echo   Push Personalized Travel Planner to GitHub
echo ===================================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not found in your PATH.
    echo Please download and install Git from: https://git-scm.com/download/win
    echo Then reopen this script!
    pause
    exit /b 1
)

echo Git is detected!
echo.
set /p username="Enter your GitHub username: "
set /p reponame="Enter your repository name [default: personalized-travel-itinerary-planner]: "

if "%reponame%"=="" set reponame=personalized-travel-itinerary-planner

echo.
echo Initializing repository...
cd /d "%~dp0"
git init
git add .
git commit -m "feat: initial commit - personalized travel planner full-stack application"
git branch -M main

echo.
echo Adding remote: https://github.com/%username%/%reponame%.git
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/%reponame%.git

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Your code is published to GitHub!
    echo Repository URL: https://github.com/%username%/%reponame%
) else (
    echo.
    echo [NOTE] If this is your first push, GitHub will open a login prompt.
    echo Please complete authentication in the popup window.
)

pause
