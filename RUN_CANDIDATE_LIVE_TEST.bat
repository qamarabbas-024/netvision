@echo off
setlocal

REM ============================================================================
REM   NETVISION - LIVE CANDIDATE LIFECYCLE & A-TO-Z UI/UX TEST RUNNER
REM ============================================================================

title NetVision Live Candidate Lifecycle and UI-UX Runner (abcd@gmail.com)

echo ============================================================================
echo   NETVISION LIVE CANDIDATE TESTING (HEADED - LIVE IN FRONT OF YOU)
echo ============================================================================
echo   Candidate Account: abcd@gmail.com
echo   Execution Mode:    HEADED (Live Browser Window Opens on Your Screen)
echo   Target Frontend:   https://netvision-three.vercel.app
echo ============================================================================
echo(

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
echo [*] Working Directory: %CD%

node -v >nul 2>&1
if errorlevel 1 (
    echo [!] ERROR: Node.js was not found in PATH.
    echo     Please install Node.js 20 or higher.
    pause
    exit /b 1
)

echo [*] Node.js Runtime detected.
echo [*] Launching real Chrome/Edge browser window right in front of your eyes...
echo [*] You will watch abcd@gmail.com register, enroll in all 5 courses,
echo     toggle bit switches, complete lessons, and unlock full XP!
echo(

node scripts\audit\test-full-candidate-lifecycle.js %*
set "EXIT_CODE=%ERRORLEVEL%"

echo(
echo ============================================================================
if "%EXIT_CODE%"=="0" (
    echo   [SUCCESS] Live Candidate Lifecycle Test completed cleanly!
    echo   Report generated at: docs\audit\CANDIDATE_LIFECYCLE_AND_UX_AUDIT.md
) else (
    echo   [NOTICE] Candidate test finished with exit code %EXIT_CODE%.
)
echo ============================================================================
echo(

pause
exit /b %EXIT_CODE%
