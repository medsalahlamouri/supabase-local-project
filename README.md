# Clinic Pro

Clinic Pro is a CRUD app for patients and consultations, built with React, TypeScript, Vite, and Supabase.

## What it does

- Patient CRUD
- Consultation CRUD
- Dashboard metrics
- Global search
- Local Supabase connection for development

## Environment files

- `frontend/.env.example` for the frontend
- `supabase  docker/.env.example` for the local Supabase stack

Copy each template to its local `.env` file:

```bash
cp frontend/.env.example frontend/.env
cp "supabase  docker/.env.example" "supabase  docker/.env"
```

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Frontend env values:

```env
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Run the full stack

```bash
docker compose --env-file "supabase  docker/.env" up -d
```

The root `docker-compose.yml` starts the frontend and the local Supabase stack together. The `--env-file` flag makes Compose reuse the same Supabase variables for the frontend build.

## Useful commands

```bash
cd frontend
npm run typecheck
npm run build
```

## Project layout

- `frontend/` React app
- `supabase  docker/` local Supabase stack files and SQL volumes
- `docker-compose.yml` single compose for the whole project
