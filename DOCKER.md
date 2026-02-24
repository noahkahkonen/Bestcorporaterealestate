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

With the bind mount (`./data:/data`), run the seed from your host (not in Docker):

```bash
cd "/Users/noahkahkonen/Best Test"
DATABASE_URL="file:$(pwd)/data/dev.db" npx tsx prisma/seed.ts
DATABASE_URL="file:$(pwd)/data/dev.db" npx tsx prisma/seed-listings.ts
```

If the database is locked (container running), stop the container first: `docker compose down`, run the seed, then `docker compose up -d`.

## Environment Variables

### Google Maps API Key (for /listings map)

Create a `.env` file in the project root (same folder as docker-compose.yml) with:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
```

Get a key at: https://console.cloud.google.com/apis/credentials

Then rebuild so the key is baked in:

```bash
docker compose down
docker compose up --build -d
```

The compose file also loads `.env.local` for runtime. If your key is in `.env.local`, copy it to `.env` as well (Docker Compose uses `.env` for build args).

## Commands

| Command | Description |
|---------|-------------|
| `docker compose up --build` | Build and start |
| `docker compose down` | Stop and remove containers |
| `docker compose exec web sh` | Shell into running container |
| `docker compose logs -f web` | View logs |
