# Cloudflare Pages Deployment Guide

## ✅ Project Readiness Status

This project is configured for **Cloudflare Pages** with **Cloudflare Workers** runtime.

---

## 🔧 What Was Fixed

### 1. **Next.js Configuration** (`next.config.mjs`)
- Added `output: 'export'` for static site generation
- Added `images.unoptimized: true` (required for Pages)
- Added ESLint ignore during builds

### 2. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- Updated to use official `cloudflare/wrangler-action@v3`
- Separated build and deploy steps for better error handling
- Updated Node.js to version 20

### 3. **Environment Variables** (`.dev.vars.example`)
- Created template for local development variables

---

## 🔑 API Token Setup (CRITICAL)

The authentication error you encountered was likely due to **insufficient API token permissions**.

### Required API Token Permissions

Create a new API token at: https://dash.cloudflare.com/profile/api-tokens

**Required permissions:**
- **Account** → **Pages** → **Edit** (for deploying Pages projects)
- **Account** → **D1** → **Edit** (for database operations)
- **Account** → **Workers Scripts** → **Edit** (if using Workers)

### Quick Setup:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Choose "Create Custom Token"
4. Name it: `kitchen-rota-deploy`
5. Set permissions:
   ```
   Account → Pages → Edit
   Account → D1 → Edit
   ```
6. Copy the token
7. Add to GitHub Secrets:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` with your token value
   - Add `CLOUDFLARE_ACCOUNT_ID` with value: `51843fc10991e152617f5f4d0433eb70`

---

## 📋 Pre-Deployment Checklist

### 1. Update `wrangler.toml`
Fill in your D1 database ID after creating it:

```bash
# Create D1 database
npx wrangler d1 create kitchen-rota-db

# Copy the database_id and update wrangler.toml
```

### 2. Set up GitHub Secrets
- `CLOUDFLARE_API_TOKEN` - Your API token with Pages permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your account ID: `51843fc10991e152617f5f4d0433eb70`

### 3. Configure Environment Variables in Cloudflare Dashboard
After first deployment, go to:
- Cloudflare Dashboard → Pages → kitchen-rota → Settings → Environment Variables
- Add production variables:
  - `NEXTAUTH_URL` - Your production URL
  - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### 4. Bind D1 Database
```bash
npx wrangler pages project update kitchen-rota --d1-binding=DB --d1-database-id=YOUR_DATABASE_ID
```

---

## 🚀 Deployment Commands

### Local Testing
```bash
# Build for Pages
npm run pages:build

# Test locally with Wrangler
npm run pages:dev
```

### Deploy from Local
```bash
npm run deploy
```

### Deploy via GitHub Actions
Push to `main` branch triggers automatic deployment.

---

## ⚠️ Common Issues & Solutions

### Authentication Error (Code: 10000)
**Cause:** API token lacks required permissions
**Fix:** Create new token with Pages + D1 Edit permissions

### Build Fails with "Module not found"
**Cause:** Missing dependency or incompatible package
**Fix:** Check `package.json` and ensure all dependencies are compatible with Cloudflare Workers

### D1 Database Not Found
**Cause:** Database ID not configured or database not created
**Fix:** Run `npx wrangler d1 create kitchen-rota-db` and update `wrangler.toml`

### NextAuth Issues
**Cause:** Missing environment variables
**Fix:** Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in Cloudflare Pages dashboard

---

## 📁 Project Structure for Cloudflare

```
kitchen-rota/
├── .github/workflows/deploy.yml    # CI/CD pipeline
├── .dev.vars.example               # Local dev env template
├── wrangler.toml                   # Cloudflare Workers config
├── next.config.mjs                 # Next.js config (updated for Pages)
├── .vercel/output/static/          # Build output (deployed to Pages)
└── prisma/                         # Database schema (D1 compatible)
```

---

## 🔗 Useful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [next-on-pages Documentation](https://github.com/cloudflare/next-on-pages)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
