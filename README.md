# Clinic Pro

Patient and consultation management application.

## About

Clinic Pro is a CRUD application for managing patients and consultations, built with:
- Frontend: React 18, TypeScript, Vite, Caddy
- Backend: Local Supabase, PostgreSQL, PostgREST
- Architecture: Docker Compose for the full development environment

### Features

- Patient management (Create, Read, Update, Delete)
- Consultation management (Create, Read, Update, Delete)
- Dashboard with metrics
- Global search
- Local Supabase authentication
- Responsive UI built with React

---

## Setup & Initialization

### 1. Prerequisites
- Docker and Docker Compose installed
- Node.js 22+ (for local development)
- npm or yarn

### 2. Project structure
```
├── frontend/           # React application
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker/             # Local Supabase configuration
│   ├── docker-compose.yml
│   └── volumes/
│
└── README.md
```

### 3. Start the full application

From the `docker/` directory:

```bash
cd docker
docker compose up -d
```

This will:
- Build the frontend image (React)
- Start the PostgreSQL database
- Launch the API gateway (Kong)
- Initialize Supabase authentication
- Expose the application at http://localhost:3000

### 4. Accessing the application

| Service | URL |
|---------|-----|
| Frontend (App) | http://localhost:3000 |
| Supabase Studio | http://localhost:8000 |
| API Kong | http://localhost:8480 |
| Database | localhost:5432 |

### 5. Environment variables

The `frontend/.env` file should contain:

```env
VITE_SUPABASE_URL=http://kong:8000
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

---

## Useful commands

### Managing containers

```bash
# Start the stack
docker compose up -d

# Stop the stack
docker compose down

# Follow frontend logs
docker compose logs -f frontend

# Rebuild after frontend changes
docker compose up -d --build frontend

# Container status
docker compose ps
```

### Local frontend development

```bash
cd frontend
npm install
npm run dev          # Development mode (http://localhost:5173)
npm run build        # Production build
npm run typecheck    # Run TypeScript type checks
```

---

## Data model

### Table: Patients
- `id`: UUID (unique identifier)
- `full_name`: Full name
- `cid`: Identification number
- `birth_date`: Birth date
- `town`: Town/city
- `created_at`: Creation timestamp

### Table: Consultations
- `id`: UUID (unique identifier)
- `patient_id`: Reference to the patient
- `appointment_date_date`: Appointment date
- `appointment_date_time`: Appointment time
- `status`: Status (scheduled, completed, canceled)
- `reason`: Reason for the consultation
- `notes`: Medical notes
- `created_at`: Creation timestamp

---

## Troubleshooting

### Frontend cannot connect to the API

Cause: The frontend runs inside a Docker container and cannot reach `localhost` on the host.

Solution: Use the Docker service name (`kong:8000`) instead of `localhost:8480`.

### Port already in use

Check for processes using the port:
```bash
netstat -ano | findstr ":3000"  # Windows
lsof -i :3000                   # Mac/Linux
```

### Data persists after restart

Data is stored in `docker/volumes/db/data` and persists after `docker compose down`. To reset everything:

```bash
docker compose down -v          # Remove volumes
docker compose up -d            # Restart everything
```

---

## Tech stack

### Frontend
- React 18: UI framework
- TypeScript: Static typing
- Vite 5: Build tool
- Supabase JS: Supabase client
- CSS Grid: Responsive layout

### Backend
- PostgreSQL 15: Database
- PostgREST 14: Automatic REST API
- Kong 3.9: API Gateway
- GoTrue: JWT authentication
- Realtime: WebSocket realtime service

### DevOps
- Docker Compose: Local orchestration
- Caddy: Web server and reverse proxy
- Node 22 Alpine: Lightweight runtime

---

## License

MIT
