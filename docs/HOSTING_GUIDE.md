# Shree Pratap Poultry Farm Hosting Guide

## 1. Platform Account Setup

### Vercel (Frontend)
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up using GitHub <SCREENSHOT_HERE>
3. Click "New Project" and import your repository <SCREENSHOT_HERE>

### Railway/Render (Backend)
1. Visit [railway.app](https://railway.app) or [render.com](https://render.com)
2. Sign up with GitHub <SCREENSHOT_HERE>
3. Create new "Web Service" and connect repository <SCREENSHOT_HERE>

## 2. MongoDB Atlas Setup
1. Log in to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create new cluster <SCREENSHOT_HERE>
3. Under Database Access:
   - Create database user
   - Set read/write permissions
4. Under Network Access:
   - Add IP whitelist (0.0.0.0/0 for development)

## 3. Domain Configuration
1. Purchase domain from registrar (GoDaddy/Namecheap)
2. In Vercel:
   - Go to Project Settings → Domains
   - Add your domain (pratappoultryfarm.in)
3. Set up DNS records:
   - A record @ → Vercel IP
   - CNAME www → cname.vercel-dns.com

## 4. Security Checklist
✅ Environment Variables Verification:
- `MONGODB_URI`=mongodb+srv://<user>:<password>@cluster.x.mongodb.net
- `JWT_SECRET`=min 32 character string
- `NODE_ENV`=production

✅ Platform-specific checks:
- Vercel: Enable "Force HTTPS"
- Railway: Set auto-deploy from main branch
- Render: Configure health check endpoints

## 5. Verification Steps
1. Frontend:
   - Visit [pratappoultryfarm.in](https://pratappoultryfarm.in)
   - Confirm language switcher works
2. Backend:
   - Test API endpoint: `GET /api/healthcheck`
3. Monitor:
   - Vercel Analytics for traffic
   - MongoDB Atlas cluster metrics