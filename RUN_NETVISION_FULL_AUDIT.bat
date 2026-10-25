@echo off
setlocal

REM ============================================================================
REM   NETVISION - FULL LIVE-BROWSER FORENSIC AUDIT & QUALITY GATE ORCHESTRATOR
REM ============================================================================

title NetVision Full Live-Browser Forensic Audit Runner

echo ============================================================================
echo   NETVISION FULL LIVE-BROWSER FORENSIC AUDIT ORCHESTRATOR
echo ============================================================================
echo(

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
echo [*] Working Directory: %CD%

node -v >nul 2>&1
if errorlevel 1 (
    echo [!] ERROR: Node.js was not found in PATH.
    echo     Please install Node.js 20 or higher.
    exit /b 1
)

echo [*] Node.js Runtime detected.

if not defined AUDIT_FRONTEND_URL set "AUDIT_FRONTEND_URL=https://netvision-three.vercel.app"
if not defined AUDIT_BACKEND_URL set "AUDIT_BACKEND_URL=https://netvision-backend.onrender.com"

echo [*] Target Frontend URL: %AUDIT_FRONTEND_URL%
echo [*] Target Backend URL:  %AUDIT_BACKEND_URL%

set "AUDIT_MODE_FLAG=--headed"
if "%1"=="--headless" set "AUDIT_MODE_FLAG=--headless"
echo [*] Execution Mode:      %AUDIT_MODE_FLAG%
echo(

echo ============================================================================
echo   LAUNCHING LIVE BROWSER AUDIT ENGINE...
echo ============================================================================
echo(

node scripts\audit\run-full-audit.js %AUDIT_MODE_FLAG% --channel=chrome --samples=30
set "EXIT_CODE=%ERRORLEVEL%"

echo(
echo ============================================================================
if "%EXIT_CODE%"=="0" (
    echo   [SUCCESS] Full audit suite completed successfully.
) else (
    echo   [NOTICE] Audit suite finished with exit code %EXIT_CODE%.
)
echo ============================================================================
echo(

exit /b %EXIT_CODE%
