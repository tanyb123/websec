#!/bin/bash

echo "========================================"
echo "  Fix React Module Error - Mac/Linux"
echo "========================================"
echo ""

echo "[1/5] Cleaning node_modules..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "✓ Removed node_modules"
else
    echo "✓ node_modules not found, skipping"
fi

echo ""
echo "[2/5] Cleaning package-lock.json..."
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    echo "✓ Removed package-lock.json"
else
    echo "✓ package-lock.json not found, skipping"
fi

echo ""
echo "[3/5] Cleaning .next cache..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✓ Removed .next"
else
    echo "✓ .next not found, skipping"
fi

echo ""
echo "[4/5] Installing dependencies..."
echo "This may take a few minutes..."
npm install
if [ $? -ne 0 ]; then
    echo "✗ npm install failed!"
    echo ""
    echo "Try running manually:"
    echo "  npm install --legacy-peer-deps"
    exit 1
fi

echo ""
echo "[5/5] Verifying installation..."
if [ -d "node_modules/react" ]; then
    echo "✓ React installed successfully"
else
    echo "✗ React not found in node_modules"
    exit 1
fi

if [ -d "node_modules/@types/react" ]; then
    echo "✓ @types/react installed successfully"
else
    echo "✗ @types/react not found"
    exit 1
fi

echo ""
echo "========================================"
echo "  ✓ Installation completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Restart VS Code TypeScript Server:"
echo "   - Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Linux)"
echo "   - Type: TypeScript: Restart TS Server"
echo ""
echo "2. Run dev server:"
echo "   npm run dev"
echo ""
