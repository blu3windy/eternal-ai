#!/usr/bin/env bash

# Bash script to install Homebrew (if needed), Docker CLI, and Colima on macOS.
# Designed for use in an Electron app for non-technical users.
# It handles permissions via sudo, provides clear prompts, and verifies the installation.

# Exit on any command failure (to prevent cascading errors)
set -e

# Log all output to a file for debugging
#LOGFILE="$HOME/colima_docker_install.log"
#exec > >(tee -a "$LOGFILE") 2>&1

echo "🚀 Starting Docker + Colima installation script..."

# 1. Request admin privileges up front and keep them alive for the script duration.
if sudo -n true 2>/dev/null; then
  echo "✅ Sudo privileges already available."
else
  echo "🔑 This action requires administrator privileges. Please enter your password if prompted."
  sudo -v || { echo "❌ ERROR: Sudo authentication failed. Cannot continue."; exit 1; }
fi
# Keep sudo alive in background
# (refreshes sudo timestamp every 60 seconds until script ends) [oai_citation_attribution:10‡stackoverflow.com](https://stackoverflow.com/questions/33664009/extending-sudo-timestamp-in-a-bash-script#:~:text=If%20you%20exceed%205%20minutes%2C,use%20The%20while%20loop)
while true; do sudo -n true; sleep 60; kill -0 "$$" 2>/dev/null || exit; done &

# Ensure the background sudo refresher is stopped when script exits
trap 'kill $(jobs -p) 2>/dev/null || true' EXIT

# 2. Check for Homebrew, install if not found.
if ! command -v brew >/dev/null 2>&1; then
  echo "📦 Homebrew not found. Installing Homebrew (this may take a few minutes)..."
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || {
    echo "❌ ERROR: Homebrew installation failed. Please check your internet connection or the log file for details."
    exit 1
  }
  echo "✅ Homebrew installed successfully."
  # Add Homebrew to PATH for this session (especially important if run via Electron with limited PATH) [oai_citation_attribution:11‡github.com](https://github.com/electron/electron/issues/7688#:~:text=The%20root%20cause%20is%20the,path%20on%20my%20machine)
  if [[ -d /opt/homebrew/bin ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -d /usr/local/bin ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo "✅ Homebrew is already installed."
fi

# 3. Ensure Homebrew is up-to-date (optional, skipped for brevity)
# sudo brew update  # (Not using to minimize time/changes for a clean system)

# 4. Install Docker CLI if not present.
if ! command -v docker >/dev/null 2>&1; then
  echo "📦 Installing Docker CLI..."
  brew install docker || { echo "❌ ERROR: Failed to install Docker CLI via Homebrew."; exit 1; }
  echo "✅ Docker CLI installed."
else
  echo "✅ Docker CLI is already installed."
fi

# 5. Install Colima if not present.
if ! brew list --versions colima >/dev/null 2>&1; then
  echo "📦 Installing Colima (lightweight Docker runtime)..."
  brew install colima || { echo "❌ ERROR: Failed to install Colima via Homebrew."; exit 1; }
  echo "✅ Colima installed."
else
  echo "✅ Colima is already installed."
fi

# 6. Start Colima (ensure the Docker daemon is running via Colima).
echo "▶️ Starting Colima to launch the Docker runtime (this may take a couple of minutes on first run)..."
if colima start; then
  echo "✅ Colima started successfully."
else
  echo "❌ ERROR: Colima failed to start. Please check the log for details."
  exit 1
fi

# 7. Start Colima (ensure the Docker daemon is running via Colima).
echo "▶️ Making colima start with system"
if brew services start colima; then
  echo "✅ Colima setup successfully."
else
  echo "❌ ERROR: Colima failed to start. Please check the log for details."
  exit 1
fi


# 8. Verify Docker is working by running a test container.
echo "🐳 Verifying Docker by running 'hello-world' test container..."
if docker run --rm hello-world; then
  echo "✅ Docker is running properly! The test container ran successfully."
else
  echo "❌ ERROR: Docker test failed. Docker may not be running correctly."
  # Suggest next steps for troubleshooting
  echo "Please ensure Colima is running (try 'colima status') and check the log file for errors."
  exit 1
fi

# 9. (Optional) Install Docker Compose CLI plugin – not required for basic setup.
if ! brew list --versions docker-compose >/dev/null 2>&1; then
  echo "📦 Installing Docker Compose plugin..."
  brew install docker-compose
  mkdir -p ~/.docker/cli-plugins
  ln -sfn "$(brew --prefix)/opt/docker-compose/bin/docker-compose" ~/.docker/cli-plugins/docker-compose
  echo "✅ Docker Compose installed (available as 'docker compose')."
fi

# 9. All done.
echo "🎉 Installation complete! Docker is ready to use with Colima."
echo "You can now run 'docker' commands on your Mac. Enjoy!"
