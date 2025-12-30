@echo off
chcp 65001 > nul
echo.
echo =======================================
echo      Admin Launcher Installer
echo =======================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Download from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo INFO: Node.js found
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Install npm packages
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo WARNING: No package.json found, continuing...
)

echo.

REM Create global link
echo Creating global link...
call npm link
if %errorlevel% neq 0 (
    echo WARNING: Could not create global link
    echo Run manually from project folder: node src/index.js
)

echo.
echo INSTALLATION COMPLETE
echo.
echo USAGE:
echo   admin-launch       - Interactive menu
echo   admin-launch cmd   - Launch CMD as admin
echo   admin-launch ps    - Launch PowerShell as admin
echo   al                - Short command
echo.
echo NOTE: Administrator rights required for elevation.
echo.
pause