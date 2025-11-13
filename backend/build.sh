#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Always run from the script's directory
cd "$(dirname "$0")"

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "==> Applying database migrations..."
python manage.py migrate --noinput
