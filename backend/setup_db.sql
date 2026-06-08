-- Correr esto como superusuario postgres:
-- psql -U postgres -h localhost -f setup_db.sql

CREATE USER martinos WITH PASSWORD 'Martinos2025x';
CREATE DATABASE martinos OWNER martinos;
GRANT ALL PRIVILEGES ON DATABASE martinos TO martinos;
