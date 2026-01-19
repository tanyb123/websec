@echo off
echo ========================================
echo  Fix React Module Error - Windows
echo ========================================
echo.

echo [1/5] Cleaning node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ Removed node_modules
) else (
    echo ✓ node_modules not found, skipping
)

echo.
echo [2/5] Cleaning package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✓ Removed package-lock.json
) else (
    echo ✓ package-lock.json not found, skipping
)

echo.
echo [3/5] Cleaning .next cache...
if exist .next (
    rmdir /s /q .next
    echo ✓ Removed .next
) else (
    echo ✓ .next not found, skipping
)

echo.
echo [4/5] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ✗ npm install failed!
    echo.
    echo Try running manually:
    echo   npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo [5/5] Verifying installation...
if exist node_modules\react (
    echo ✓ React installed successfully
) else (
    echo ✗ React not found in node_modules
    pause
    exit /b 1
)

if exist node_modules\@types\react (
    echo ✓ @types/react installed successfully
) else (
    echo ✗ @types/react not found
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✓ Installation completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Restart VS Code TypeScript Server:
echo    - Press Ctrl+Shift+P
echo    - Type: TypeScript: Restart TS Server
echo.
echo 2. Run dev server:
echo    npm run dev
echo.
pause
