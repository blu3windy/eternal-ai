#!/usr/bin/env bash

# Bash script to install Homebrew (if needed), Docker CLI, and Colima on macOS.
# Designed for use in an Electron app for non-technical users.
# It handles permissions via sudo, provides clear prompts, and verifies the installation.

# Exit on any command failure (to prevent cascading errors)
set -e

# 1. Install Docker CLI if not present.
if ! command -v docker >/dev/null 2>&1; then
  echo "📦 Installing Docker CLI..."
  nix-env -iA nixpkgs.docker-client || { echo "❌ ERROR: Failed to install Docker CLI via Homebrew."; exit 1; }
  echo "✅ Docker CLI installed."
else
  echo "✅ Docker CLI is already installed."
fi

# 2. Install Colima if not present.
if ! command -v colima >/dev/null 2>&1; then
  echo "📦 Installing Colima (lightweight Docker runtime)..."
  nix-env -iA nixpkgs.colima
  echo "✅ Colima installed."
else
  echo "✅ Colima is already installed."
fi

# 3. Start Colima (ensure the Docker daemon is running via Colima).
echo "▶️ Starting Colima to launch the Docker runtime (this may take a couple of minutes on first run)..."
if colima start; then
  echo "✅ Colima started successfully."
else
  echo "❌ ERROR: Colima failed to start. Please check the log for details."
  exit 1
fi


# 4. Verify Docker is working by running a test container.
echo "🐳 Verifying Docker by running 'hello-world' test container..."
if docker run --rm hello-world; then
  echo "✅ Docker is running properly! The test container ran successfully."
else
  echo "❌ ERROR: Docker test failed. Docker may not be running correctly."
  # Suggest next steps for troubleshooting
  echo "Please ensure Colima is running (try 'colima status') and check the log file for errors."
  exit 1
fi

# 5. (Optional) Install Docker Compose CLI plugin – not required for basic setup.
if ! command -v docker-compose >/dev/null 2>&1; then
  echo "📦 Installing Docker Compose plugin..."
  nix-env -iA nixpkgs.docker-compose
  echo "✅ Docker Compose installed (available as 'docker compose')."
fi

# 6. All done.
echo "🎉 Installation complete! Docker is ready to use with Colima."
echo "You can now run 'docker' commands on your Mac. Enjoy!"
