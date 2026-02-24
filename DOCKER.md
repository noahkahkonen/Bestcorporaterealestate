# Running with Docker

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

```bash
# Build and run
docker compose up --build

# App runs at http://localhost:3000
```

## First Run: Seed the Database

After the first successful start, seed the database:

```bash
docker compose exec web npx prisma db seed
docker compose exec web npx tsx prisma/seed-listings.ts
```

Or in one command (with container stopped):

```bash
docker compose run --rm web sh -c "npx prisma migrate deploy && npx prisma db seed && npx tsx prisma/seed-listings.ts"
```

## Environment Variables

Create `.env.local` with your keys (Google Maps, Stripe, etc.) and uncomment the `env_file` section in `docker-compose.yml`.

Or pass variables directly:

```bash
docker compose run -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key web
```

## Commands

| Command | Description |
|---------|-------------|
| `docker compose up --build` | Build and start |
| `docker compose down` | Stop and remove containers |
| `docker compose exec web sh` | Shell into running container |
| `docker compose logs -f web` | View logs |
