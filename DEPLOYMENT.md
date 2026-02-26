# Deploying Best CRE to bestcorporate.shop

This guide covers getting your site live at **bestcorporate.shop**. The recommended path is **Vercel** (free, built for Next.js). You can later point DNS elsewhere if needed.

---

## Option A: Vercel (Recommended)

Vercel is free for hobby projects and handles Next.js, SSL, and CDN automatically.

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: leave default

### 3. Environment Variables

In Vercel → Project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your Neon **pooled** connection string | From Neon dashboard → Connect → enable "Connection pooling" → copy. Must include `-pooler` in hostname (e.g. `ep-xxx-pooler.us-east-2.aws.neon.tech`). Add `?pgbouncer=true` if not present. |
| `NEXTAUTH_URL` | `https://bestcorporate.shop` | Your production URL |
| `NEXTAUTH_SECRET` | Random 32+ char string | Generate: `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Your admin username | |
| `ADMIN_PASSWORD` | Strong password | Use bcrypt hash in production |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Maps API key | Add `https://bestcorporate.shop/*` to referrers |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Use live keys for production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook | Create webhook for `https://bestcorporate.shop/api/webhooks/stripe` |
| `APPLICATION_FEE_CENTS` | `5000` | $50 application fee |
| `BLOB_READ_WRITE_TOKEN` | (auto) | Create Vercel Blob store: Project → Storage → Create → Blob. Token is auto-added. Required for agent/listing image uploads. |

### 4. Add Domain

1. Vercel → Project → **Settings** → **Domains**.
2. Add `bestcorporate.shop` and `www.bestcorporate.shop`.
3. Vercel will show the DNS records you need.

### 5. Update DNS at Hostinger

In Hostinger → **Domains** → **bestcorporate.shop** → **DNS / Nameservers**:

**For apex (bestcorporate.shop):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP – check Vercel for current value)

**For www:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

Vercel’s domain settings will show the exact values. Propagation can take up to 48 hours (often minutes).

### 6. Run Migrations

After first deploy, run migrations (one-time):

```bash
DATABASE_URL="your_neon_url" npx prisma migrate deploy
```

Or use Vercel’s deploy hook / build command to run migrations automatically.

---

## Option B: Hostinger VPS

If you have a Hostinger **VPS** (not shared hosting), you can run the app with Node.js.

### Requirements

- Hostinger VPS (KVM or similar)
- SSH access
- Domain pointed to VPS IP

### Quick Setup

1. **SSH into your VPS** and install Node.js 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and build**:

```bash
git clone https://github.com/yourusername/your-repo.git bestcre
cd bestcre
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

3. **Run with PM2**:

```bash
sudo npm install -g pm2
pm2 start npm --name "bestcre" -- start
pm2 save
pm2 startup
```

4. **Set up Nginx** as reverse proxy (port 3000 → 80/443) and SSL with Let’s Encrypt.

5. **Environment variables**: Create `.env` on the server with production values.

---

## Troubleshooting: "Application error: a server-side exception has occurred"

If pages fail to load on Vercel:

1. **Use Neon pooled connection** – In Neon dashboard → Connect → enable "Connection pooling". Copy the string (hostname has `-pooler`). Set as `DATABASE_URL` in Vercel.
2. **Add `?pgbouncer=true`** – Append to `DATABASE_URL` if not present (e.g. `...?sslmode=require&pgbouncer=true`). The app adds this automatically when it detects a pooled URL.
3. **Check Vercel logs** – Project → Deployments → select deployment → Functions → view logs for the actual error.
4. **Verify env vars** – Ensure `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` are set. `NEXTAUTH_URL` must be your production URL (e.g. `https://bestcorporaterealestate.vercel.app`).
5. **Image uploads** – Create a Vercel Blob store: Project → **Storage** tab → **Create** → **Blob**. This adds `BLOB_READ_WRITE_TOKEN` automatically. Redeploy after creating.

---

## Post-Deploy Checklist

- [ ] Google Maps: Add `https://bestcorporate.shop/*` to API key referrer restrictions
- [ ] Stripe: Create production webhook for `/api/webhooks/stripe`
- [ ] NextAuth: Set `NEXTAUTH_URL` to `https://bestcorporate.shop`
- [ ] Test: Listings, contact form, lease application, admin login

---

## Switching DNS Later

To point bestcorporate.shop to a different host later:

1. In Hostinger DNS, update the A record and CNAME to the new server’s IP/hostname.
2. Wait for DNS propagation.
3. No code changes needed if the new host serves the same app.
