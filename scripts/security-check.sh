#!/bin/bash
set -e

echo "🔒 Running npm security audit..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CRITICAL=$(npm audit 2>&1 | grep -c "critical" || true)
HIGH=$(npm audit 2>&1 | grep -c "high" || true)
MODERATE=$(npm audit 2>&1 | grep -c "moderate" || true)
LOW=$(npm audit 2>&1 | grep -c "low" || true)

echo ""
echo "Vulnerability Summary:"
echo "  🔴 CRITICAL: $CRITICAL"
echo "  🟠 HIGH:     $HIGH"
echo "  🟡 MODERATE: $MODERATE"
echo "  🟢 LOW:      $LOW"
echo ""

if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
  echo "❌ VULNERABLE DEPENDENCIES DETECTED!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Fix with one of these:"
  echo ""
  echo "Option 1: Auto-fix (may break things):"
  echo "  npm audit fix"
  echo ""
  echo "Option 2: Update specific package:"
  echo "  npm update package-name@latest"
  echo ""
  echo "Option 3: Remove unused dependency:"
  echo "  npm remove package-name"
  echo ""
  echo "Option 4: Use older safe version:"
  echo "  npm add package-name@X.Y.Z"
  echo ""
  echo "After fixing, verify:"
  echo "  npm audit --audit-level high"
  echo ""
  exit 1
else
  echo "✅ No HIGH or CRITICAL vulnerabilities found!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi
