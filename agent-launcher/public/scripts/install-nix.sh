#!/usr/bin/env bash

# Bash script to install nix (if needed)
# Exit on any command failure (to prevent cascading errors)
set -e


echo "🚀 Starting nix installation script..."

# 2. Check for nix, install if not found.
if ! command -v nix >/dev/null 2>&1; then
  echo "📦 nix not found. Installing nix (this may take a few minutes)..."
  sudo /bin/bash -c "$(curl -fsSL https://nixos.org/nix/install)" || {
    echo "❌ ERROR: nix installation failed. Please check your internet connection or the log file for details."
    exit 1
  }
  echo "✅ nix installed successfully."
else
  echo "✅ nix is already installed."
fi
