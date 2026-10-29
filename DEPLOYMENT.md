# Awiad ERP - Deployment Guide

## Overview

This guide covers deploying the Awiad ERP multi-tenant SaaS MVP to free tier services:

- **Frontend**: Cloudflare Pages (free tier)
- **Backend**: Railway, Render, or similar (free tier)
- **Database**: Neon Serverless PostgreSQL (already configured)

## Prerequisites

- GitHub account
- Cloudflare account
- Railway or Render account (for backend)
- Neon account (database already provisioned)

---

## Step 1: Push Code to GitHub

```bash
cd c:\Users\ramesh.bhagat\source\repos\VSCode\erp
git init
git add .
git commit -m "Initial commit - Awiad ERP MVP"
git remote add origin https://github.com/YOUR_USERNAME/awiaderp.git
git push -u origin main
```

---

## Step 2: Deploy Frontend to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** → **Create application** → **Pages**
3. Connect your GitHub repository
4. Select the `awiaderp` repo
5. Configure build settings:
   - **Project name**: `awiaderp-frontend`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
6. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api` (or Render URL)
7. Click **Save and Deploy**

### Option B: Via Wrangler CLI

```bash
cd frontend
npm install
npx wrangler pages deploy dist --project-name=awiaderp-frontend
```

### Cloudflare Pages Configuration

The `wrangler.toml` is already configured:

```toml
name = "awiaderp-frontend"
build.command = "npm run build"
build.outputDirectory = "dist"
[observability]
enabled = true
```

The `public/_redirects` file handles SPA routing:

```
/*    /index.html   200
```

---

## Step 3: Deploy Backend to Render (Free Tier)

### Render Deployment

1. Log in to [Render.com](https://render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository (`rbhagat0/awiaderp`)
4. Configure these settings:
   - **Runtime**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add these environment variables:
   - `DATABASE_URL` = `postgresql://neondb_owner:npg_Rc5EjWz8iNdK@ep-divine-recipe-aorvmk9o-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET` = `awiaderp-super-secret-jwt-key-change-in-production`
   - `JWT_EXPIRES_IN` = `7d`
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Cloudflare Pages URL (e.g., `https://awiaderp-frontend.pages.dev`)
6. Click **Create Web Service**
7. Render will deploy your backend and give you a URL like `https://awiaderp-backend.onrender.com`

---

## Step 4: Update Frontend API URL

After backend deployment, update the frontend environment variable:

1. Go to Cloudflare Dashboard → Workers & Pages → your project
2. Go to **Settings** → **Environment variables**
3. Update `VITE_API_URL` to point to your deployed backend:
   - `VITE_API_URL=https://your-backend-url.up.railway.app/api`
4. Redeploy the frontend

---

## Step 5: Database Setup (Neon)

The database is already provisioned on Neon. Connection string is in `backend/.env`:

```
DATABASE_URL=postgresql://neondb_owner:npg_Rc5EjWz8iNdK@ep-divine-recipe-aorvmk9o-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

To run migrations on production:

```bash
cd backend
npm run migrate
npm run seed
```

---

## Step 6: Verify Deployment

1. Visit your Cloudflare Pages URL
2. Login with: `superadmin@awiaderp.com` / `admin123`
3. Test all modules:
   - Master Admin Dashboard (`/admin`)
   - Company Home Hub (`/home`)
   - Sales CRM (`/sales`)
   - Project Module (`/projects`)

---

## Architecture Summary

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Cloudflare     │      │   Railway/Render │      │     Neon        │
│  Pages (Front)  │─────▶│   (Backend API)  │─────▶│  PostgreSQL     │
│  React + Vite   │      │   Express + pg   │      │   (Serverless)  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
  Free tier              Free tier ($5 credit)      Free tier
  Unlimited bandwidth    750 hours/month            0.5 GB storage
```

---

## Free Tier Limits

| Service | Free Tier Limits |
|---------|-----------------|
| Cloudflare Pages | Unlimited builds, unlimited bandwidth, 100 custom domains |
| Railway | $5 credit/month (~500 hours of tiny instance) |
| Render | 750 hours/month, spins down after inactivity |
| Neon | 0.5 GB storage, 10 concurrent connections |

---

## Troubleshooting

### Backend returns 500 on login

Ensure environment variables are set on the backend:
- `DATABASE_URL` - Neon connection string
- `JWT_SECRET` - Any random string
- `JWT_EXPIRES_IN` - e.g., `7d`

### Frontend can't connect to backend

1. Check `VITE_API_URL` in Cloudflare Pages environment variables
2. Ensure backend CORS allows your frontend URL (`FRONTEND_URL` env var)
3. Check browser console for CORS errors

### SPA routes return 404 on refresh

The `public/_redirects` file handles this. Ensure it's included in the build output.

---

## Files Modified for Deployment

- `frontend/wrangler.toml` - Cloudflare Pages config (TOML format)
- `frontend/public/_redirects` - SPA routing fallback
- `frontend/package.json` - Already has `deploy` script
- `DEPLOYMENT.md` - This file
