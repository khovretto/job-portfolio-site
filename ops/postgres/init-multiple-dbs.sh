#!/bin/sh
set -e

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "$POSTGRES_MULTIPLE_DATABASES" | tr ',' ' ' | while read -r databases; do
    for database in $databases; do
      echo "Ensuring database: $database"
      psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        SELECT 'CREATE DATABASE "$database"'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\\gexec
EOSQL
    done
  done
fi
