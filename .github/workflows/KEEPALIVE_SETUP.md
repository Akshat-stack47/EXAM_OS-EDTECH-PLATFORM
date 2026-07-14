# 🔆 Supabase Keep-Alive Setup

This GitHub Action runs **every day at 6 AM IST** and pings your app's `/api/health`
endpoint — this prevents Supabase free-tier from auto-pausing your database.

## One-Time Setup (5 minutes)

### Step 1: Push this project to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/exam-os.git
git push -u origin main
```

### Step 2: Add the APP_URL secret
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `APP_URL`
4. Value: Your deployed URL (e.g. `https://examos.vercel.app`) OR `http://localhost:3001` for local testing
5. Click **Add secret**

### Step 3: Verify it works
- Go to your repo → **Actions** tab
- Click **"Keep Supabase Alive"** workflow
- Click **"Run workflow"** → **"Run workflow"** (manual trigger)
- It should show a green ✅ within 30 seconds

## How it works

```
Every day at 6 AM IST
    ↓
GitHub Actions pings /api/health
    ↓
/api/health does SELECT 1 on Supabase
    ↓
Supabase sees activity → does NOT pause the project
    ↓
Your data stays available 24/7 🎉
```

## Without a deployed URL?

If you're only running locally, you can use a free tunnel service:
- **ngrok**: `npx ngrok http 3001` → use the https URL as APP_URL
- Or deploy to Vercel (free): `npx vercel` → use the Vercel URL

## Supabase also has a paid upgrade

If you upgrade to Supabase **Pro ($25/month)**, projects never pause.
The free tier pauses after **7 days of inactivity**.
