#!/bin/bash
ENTRY=$1
DATE=$(date +"%Y-%m-%d")

if [ -z "$ENTRY" ]; then
  echo "Usage: ./scripts/create-changelog-entry.sh \"your change description\""
  exit 1
fi

# Add entry to Unreleased section
sed -i "s/## \[Unreleased\]/## [Unreleased]\n### Changed\n- $ENTRY ($DATE)/" CHANGELOG.md
echo "Added to CHANGELOG.md: $ENTRY"
