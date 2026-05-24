#!/usr/bin/env bash
set -euo pipefail

# ExamOS Deployment Script
# Usage: bash scripts/deploy.sh <environment>
#   environment: "staging" | "production"

ENVIRONMENT="${1:?"Usage: $0 <staging|production>"}"

echo "=== ExamOS Deployment: $ENVIRONMENT ==="

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo "Error: environment must be 'staging' or 'production'"
  exit 1
fi

# 1. Run database migrations
echo "--- Running database migrations ---"
npx prisma migrate deploy

# 2. Build the application
echo "--- Building application ---"
pnpm build

# 3. Run schema validation
echo "--- Validating Prisma schema ---"
npx prisma validate

# 4. Deploy to Vercel
echo "--- Deploying to Vercel ($ENVIRONMENT) ---"
npx vercel --prod --scope=exam-os

# 5. Health check
echo "--- Waiting for deployment to settle (10s) ---"
sleep 10

HEALTH_URL="https://$ENVIRONMENT.examos.app/health"
echo "--- Running health check against $HEALTH_URL ---"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")
if [[ "$HTTP_STATUS" -ne 200 ]]; then
  echo "Error: Health check failed with status $HTTP_STATUS"
  exit 1
fi

echo "=== Deployment to $ENVIRONMENT completed successfully ==="
