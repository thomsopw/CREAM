# Cream — AI Event-Driven Stock Research Platform

A LevelFields-style platform for event-driven investment research. AI scans for events proven to impact stock prices and surfaces patterns, alerts, and opportunities.

## Features

- **Scenarios** — 15+ event types with historical performance (win rate, avg returns)
- **Events Feed** — Filterable table of detected events with price impacts
- **Company Profiles** — Stock overview, event history, price reaction charts
- **Watchlists** — Track stocks and monitor for major events
- **Alerts** — Create alerts by event type and min return (email coming soon)
- **Dashboard** — Recent events, top scenarios, watchlist activity

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS, shadcn/ui-style components
- NextAuth.js (Credentials provider)
- Prisma + Neon (PostgreSQL)
- Recharts
- Mock data (swap for real APIs later)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a [Neon](https://console.neon.tech) project and copy the connection strings (pooled + direct).

3. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — Neon pooled connection string
   - `DIRECT_URL` — Neon direct connection string
   - `NEXTAUTH_SECRET`

   ```bash
   cp .env.example .env
   ```

4. Push the schema to Neon:

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Auth

For this prototype, any email/password works. Users are created on first sign-in.

## Project Structure

```
cream/
├── app/
│   ├── (marketing)/     # Landing, About, How it Works, FAQ, Pricing
│   ├── (app)/           # Dashboard, Scenarios, Events, Watchlist, Alerts
│   ├── auth/            # Sign in, Sign up
│   └── api/             # Auth, watchlist, alerts
├── components/
├── lib/
├── data/seed/           # Mock scenarios, events, companies
└── prisma/
```

## Deploy to Netlify

1. Connect [CREAM](https://github.com/thomsopw/CREAM) to Netlify (Site settings → Build & deploy → Connect repository).
2. Set environment variables in Netlify (Site settings → Environment variables):
   - `DATABASE_URL` — Neon pooled connection string (from [Neon console](https://console.neon.tech))
   - `DIRECT_URL` — Neon direct connection string
   - `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — Your Netlify site URL (e.g. `https://your-site.netlify.app`)
3. Deploy. The `netlify.toml` and `@netlify/plugin-nextjs` handle the build.

## Disclaimer

This is not financial advice. Past performance does not guarantee future results.
