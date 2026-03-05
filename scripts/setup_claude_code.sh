#!/bin/bash

# Only run in remote Claude Code environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

set -e

echo "Setting up environment for Claude Code..."

# Install Composer dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --quiet

# Install npm dependencies
echo "Installing npm dependencies..."
npm ci --silent

echo "Setup complete!"
exit 0
