# Connecting to Neon Database

This guide walks you through connecting the Best CRE site to your **Neon** PostgreSQL database so listings and agents load from your data.

---

## 1. Get Your Neon Connection Strings

1. Go to [neon.tech](https://neon.tech) and sign in (or create an account).
2. Open your project (or create a new one).
3. Click **Connect** in the dashboard.
4. In the connection dialog:
   - Toggle **Connection pooling** ON.
   - Copy the **pooled** connection string (hostname includes `-pooler`).
   - Copy the **direct** connection string (hostname does *not* include `-pooler`).

---

## 2. Add Environment Variables

Create a `.env.local` file in the project root (or add to an existing one):

```bash
# Pooled connection – used by the app for queries
# Hostname should contain -pooler (e.g. ep-xxx-pooler.us-east-2.aws.neon.tech)
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require"

# Direct connection – used by Prisma for migrations
# Hostname should NOT contain -pooler (e.g. ep-xxx.us-east-2.aws.neon.tech)
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/neondb?sslmode=require"
```

Replace `USER`, `PASSWORD`, and the hostnames with your actual Neon values. The app will automatically append `?pgbouncer=true` to `DATABASE_URL` when it detects a pooled connection.

---

## 3. Run Migrations

Create the tables in your Neon database:

```bash
npm run db:migrate
```

This applies the Prisma schema (`Agent`, `Listing`, `News`, etc.) to your Neon project.

---

## 4. Seed Data (if database is empty)

If your database is new and empty, run the seeds to add agents and sample listings:

```bash
# Add team agents (Valerie Tivin, Randy Best, etc.)
npm run db:seed

# Add sample listings from data/listings.json
npm run db:seed-listings
```

If you already have listings/agents in Neon, you can skip this step. To import your own listings from a CSV, see `data/LISTINGS-IMPORT-README.md` and use:

```bash
npm run db:import-listings
```

---

## 5. Verify

1. Start the dev server: `npm run dev`
2. Visit `/listings` – you should see your listings.
3. Visit `/team` – you should see your agents.
4. Visit `/` – featured listings and recent transactions should load from Neon.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Can't reach database server" | Ensure your Neon project is running and the connection strings are correct. Neon pauses inactive projects; wake it from the dashboard. |
| "Migration failed" | Use the **direct** connection string for `DIRECT_URL` (no `-pooler` in hostname). |
| Empty listings/agents | Run `npm run db:migrate`, `npm run db:seed`, and `npm run db:seed-listings`. |
| Pooler / transaction errors | The app adds `?pgbouncer=true` to pooled URLs. If issues persist, verify `DATABASE_URL` uses the pooled connection. |

---

## Production (Vercel)

For production, add the same `DATABASE_URL` and `DIRECT_URL` in Vercel → Project → Settings → Environment Variables. Use your Neon production connection strings.
