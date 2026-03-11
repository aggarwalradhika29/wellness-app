# Supabase Setup (5 minutes, free forever)

## Step 1 — Create Supabase Account
1. Go to https://supabase.com → click "Start your project"
2. Sign in with GitHub
3. Click "New Project"
4. Name it `wellness-app`, set a password, choose region: **Southeast Asia (Singapore)** — closest to Delhi
5. Click "Create new project" — wait ~2 minutes

## Step 2 — Create Database Tables
1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `lib/supabase-schema.sql` from this project
4. Copy ALL the SQL and paste it into the editor
5. Click **Run** — you should see "Success"

## Step 3 — Get Your API Keys
1. Go to **Settings → API** (left sidebar)
2. Copy **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4 — Add Keys to Your Project

### For local development:
1. In your project folder, create a file called `.env.local`
2. Add these two lines:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c....
```
3. Run `npm run dev` — data will now save to Supabase!

### For Vercel deployment:
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add `NEXT_PUBLIC_SUPABASE_URL` with your URL
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your key
4. Click **Save** → Vercel will auto-redeploy

## That's it!
Your data now persists across all devices forever.
The app automatically falls back to localStorage if Supabase is not configured.
