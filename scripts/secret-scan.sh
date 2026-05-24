#!/bin/bash
set -e

echo "🔍 Scanning for secrets in codebase..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v gitleaks &> /dev/null; then
  echo "⚠️  gitleaks not installed"
  echo ""
  echo "Install with:"
  echo "  macOS:  brew install gitleaks"
  echo "  Linux:  curl -sSfL https://raw.githubusercontent.com/gitleaks/gitleaks/master/install.sh | sh"
  echo "  Docker: docker pull gitleaks/gitleaks"
  echo ""
  exit 1
fi

echo "Running gitleaks detect..."
if gitleaks detect \
  --source . \
  --verbose \
  --config .gitleaks.toml \
  --redact; then
  echo "✅ No secrets found"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo ""
  echo "❌ SECRETS FOUND IN CODEBASE!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "⚠️  DO NOT COMMIT THESE FILES"
  echo ""
  echo "Actions:"
  echo "1. Remove the secret from the file"
  echo "2. If secret was exposed: ROTATE IT IMMEDIATELY"
  echo "3. Add to .gitleaks.toml allowlist if false positive"
  echo "4. Re-run: ./scripts/secret-scan.sh"
  echo ""
  exit 1
fi
