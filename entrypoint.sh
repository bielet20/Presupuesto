#!/bin/sh

# If the database doesn't exist, create it and run migrations
if [ ! -f "/app/data/dev.db" ]; then
    echo "Initializing database..."
    npx prisma migrate deploy
fi

exec "$@"
