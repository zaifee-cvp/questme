@echo off
echo FieldService Pro - Setup
echo ========================
echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo npm install failed!
    pause
    exit /b 1
)
echo.
echo Done! Now edit .env.local with your Supabase and Resend keys, then run:
echo   npm run dev
echo.
pause
