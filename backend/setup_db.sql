-- Correr esto como superusuario postgres:
-- psql -U postgres -h localhost -f setup_db.sql

CREATE USER martinos_user WITH PASSWORD 'martinosdb';
CREATE DATABASE martinos OWNER martinos_user;
GRANT ALL PRIVILEGES ON DATABASE martinos TO martinos_user;
