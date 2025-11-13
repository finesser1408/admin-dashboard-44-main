#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Exit if any command fails
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "==> Applying database migrations..."
python manage.py migrate --noinput
