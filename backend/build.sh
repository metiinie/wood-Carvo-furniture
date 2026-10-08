#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== Installing dependencies ==="
if command -v uv &> /dev/null; then
    uv pip install --system -r requirements.txt
else
    pip install -r requirements.txt
fi

echo "=== Collecting static files ==="
python manage.py collectstatic --no-input

echo "=== Running database migrations ==="
python manage.py migrate --no-input

echo "=== Build finished successfully ==="
