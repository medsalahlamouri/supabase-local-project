@echo off
setlocal

docker compose exec -T db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations/100-app-schema.sql
if errorlevel 1 exit /b %errorlevel%

docker compose exec -T db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations/101-app-seed.sql
if errorlevel 1 exit /b %errorlevel%
