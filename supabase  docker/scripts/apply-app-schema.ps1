$ErrorActionPreference = "Stop"

docker compose exec -T db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations/100-app-schema.sql
docker compose exec -T db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations/101-app-seed.sql
