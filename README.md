# Clinic Pro

Application de gestion de patients et consultations médicales.

## À propos

**Clinic Pro** est une application CRUD pour les patients et consultations, construite avec:
- **Frontend**: React 18, TypeScript, Vite, Caddy
- **Backend**: Supabase (local), PostgreSQL, PostgREST
- **Architecture**: Docker Compose pour l'environnement de développement complet

### Fonctionnalités

✅ Gestion des patients (Créer, Lire, Mettre à jour, Supprimer)  
✅ Gestion des consultations (Créer, Lire, Mettre à jour, Supprimer)  
✅ Tableau de bord avec métriques  
✅ Recherche globale  
✅ Authentification Supabase local  
✅ Interface réactive avec React  

---

## Configuration & Initialisation

### 1. Prérequis
- Docker et Docker Compose installés
- Node.js 22+ (pour développement local)
- npm ou yarn

### 2. Structure du projet
```
├── frontend/           # Application React
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker/             # Configuration Supabase local
│   ├── docker-compose.yml
│   └── volumes/
│
└── README.md
```

### 3. Démarrer l'application complète

Depuis le dossier `docker/`:

```bash
cd docker
docker compose up -d
```

Cela va:
- ✅ Construire l'image du frontend (React)
- ✅ Démarrer la base de données PostgreSQL
- ✅ Lancer le gateway API (Kong)
- ✅ Initialiser l'authentification Supabase
- ✅ Exposer l'application sur http://localhost:3000

### 4. Accès à l'application

| Service | URL |
|---------|-----|
| **Frontend (App)** | http://localhost:3000 |
| **Supabase Studio** | http://localhost:8000 |
| **API Kong** | http://localhost:8480 |
| **Base de données** | localhost:5432 |

### 5. Variables d'environnement

Le fichier `frontend/.env` doit contenir:

```env
VITE_SUPABASE_URL=http://kong:8000
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

---

## Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer la stack
docker compose up -d

# Arrêter la stack
docker compose down

# Voir les logs
docker compose logs -f frontend

# Reconstruire après modification du frontend
docker compose up -d --build frontend

# Status des conteneurs
docker compose ps
```

### Développement frontend local

```bash
cd frontend
npm install
npm run dev          # Mode développement (http://localhost:5173)
npm run build        # Build production
npm run typecheck    # Vérifier les types TypeScript
```

---

## Structure des données

### Table: Patients
- `id`: UUID (identifiant unique)
- `full_name`: Nom complet
- `cid`: Numéro d'identification
- `birth_date`: Date de naissance
- `town`: Ville
- `created_at`: Date de création

### Table: Consultations
- `id`: UUID (identifiant unique)
- `patient_id`: Référence au patient
- `appointment_date_date`: Date du rendez-vous
- `appointment_date_time`: Heure du rendez-vous
- `status`: Statut (planifiée, terminée, annulée)
- `reason`: Raison de la consultation
- `notes`: Notes médicales
- `created_at`: Date de création

---

## Dépannage

### Le frontend ne peut pas se connecter à l'API

**Cause**: Le frontend est dans un conteneur Docker et ne peut pas accéder à `localhost`

**Solution**: Utilisez le nom du service Docker (`kong:8000`) à la place de `localhost:8480`

### Erreur de port déjà utilisé

Vérifiez les ports occupés:
```bash
netstat -ano | findstr ":3000"  # Windows
lsof -i :3000                   # Mac/Linux
```

### Les données persistent après redémarrage

Les données sont stockées dans `docker/volumes/db/data` et persistent après `docker compose down`. Pour tout réinitialiser:

```bash
docker compose down -v          # Supprime les volumes
docker compose up -d            # Redémarre tout
```

---

## Stack technologique

### Frontend
- **React 18**: UI framework
- **TypeScript**: Typage statique
- **Vite 5**: Build tool
- **Supabase JS**: Client Supabase
- **CSS Grid**: Layout responsive

### Backend
- **PostgreSQL 15**: Base de données
- **PostgREST 14**: API REST automatique
- **Kong 3.9**: API Gateway
- **GoTrue**: Authentification JWT
- **Realtime**: WebSocket en temps réel

### DevOps
- **Docker Compose**: Orchestration locale
- **Caddy**: Web server et reverse proxy
- **Node 22 Alpine**: Runtime léger

---

## Licence

MIT
