@echo off
echo ===================================================================
echo   Personalized Travel Itinerary Planner - Windows Quick Start
echo ===================================================================
echo.
echo Choose an option:
echo [1] Launch Instant Interactive Browser Demo (Zero Dependencies, Double-Click and Run!)
echo [2] Start FastAPI Backend (requires Python)
echo [3] Start React Frontend (requires Node.js)
echo [4] Start full stack via Docker Compose
echo.
set /p choice="Enter choice (1-4, default is 1): "

if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo Opening demo_preview/index.html in your default web browser...
    start "" "%~dp0demo_preview\index.html"
    exit /b
)

if "%choice%"=="2" (
    echo Starting FastAPI backend...
    cd "%~dp0backend"
    python run.py
    exit /b
)

if "%choice%"=="3" (
    echo Starting React frontend...
    cd "%~dp0frontend"
    npm run dev
    exit /b
)

if "%choice%"=="4" (
    echo Starting Docker Compose...
    cd "%~dp0"
    docker compose up --build
    exit /b
)
