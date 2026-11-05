# 🌿 My Wellness App

A personal wellness tracker — fitness, sleep, skincare & diet plan.
Built with Next.js 16, React 19, Tailwind CSS and Supabase. Data is stored in Supabase behind a private login, with row-level security on every table.

## Features
- ✅ Daily habit tracker (workout, skincare AM/PM, dinner time, phone habits)
- 🔥 Streak counter
- 💧 Water intake tracker (8 glasses)
- 😴 Sleep logger with quality rating & history
- ⚖️ Weight tracker with trend chart
- 🍽️ Meal log
- 📋 Full wellness plan (sleep reset, fitness, diet, skincare, schedule)
- 📈 Progress dashboard with charts

---

## 🚀 Deploy to Vercel (Free — 5 minutes)

### Step 1: Upload to GitHub
1. Go to [github.com](https://github.com) → sign in → click **New repository**
2. Name it `wellness-app`, click **Create repository**
3. Download this folder as a ZIP, then drag-and-drop all files into the GitHub repo
   OR use GitHub Desktop app to push the folder

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **Add New → Project**
3. Select your `wellness-app` repository
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under **Environment Variables** (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
5. Click **Deploy**
6. Wait ~2 minutes → you get a live URL like `wellness-app-xyz.vercel.app`

### Step 3: Add to iPhone Home Screen
1. Open the URL in Safari on your iPhone
2. Tap the **Share** button (square with arrow)
3. Tap **Add to Home Screen**
4. Name it "Wellness" → tap **Add**
5. It now opens full-screen like an app 🎉

### Step 3 (Android): Add to Home Screen
1. Open the URL in Chrome
2. Tap the **3-dot menu** → **Add to Home screen**
3. Done!

---

## 💻 Run Locally (optional)

Set up a Supabase project first ([SUPABASE_SETUP.md](SUPABASE_SETUP.md)), then:

```bash
npm install
cp .env.local.example .env.local   # add your Supabase URL and anon key
npm run dev
# Opens at http://localhost:3000
```

---

## Tech Stack
- **Next.js 16** (App Router) with **React 19**
- **Tailwind CSS**
- **Recharts** (progress charts)
- **Supabase** (Postgres, Auth and row-level security)

---

*Built for personal use. Each row is readable only by the signed-in owner.*
