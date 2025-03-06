#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Step 1: Check and install Homebrew if not present
if ! command_exists brew; then
  echo "Homebrew not found. Installing Homebrew in $HOME/homebrew..."
  mkdir -p "$HOME/homebrew" && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C "$HOME/homebrew"
  # Silently update PATH for this script
  export PATH="$HOME/homebrew/bin:$PATH"
  echo 'export PATH="$HOME/homebrew/bin:$PATH"' >> $HOME/.zshrc
else
  echo "Homebrew is already installed at $(which brew)."
fi

# Step 2: Check and install docker if not present
if ! docker; then
  echo "Installing docker via Homebrew..."
  brew install docker
else
  echo "docker is already installed."
  # Check if Docker Desktop is installed
  if [ -d "/Applications/Docker.app" ]; then
    echo "Docker Desktop is installed. Opening Docker..."
    open -a Docker

    # Wait for 5 seconds
    sleep 5
  else
    echo "Docker Desktop is not installed."
  fi
fi

# Step 3: Check and install colima
if ! docker info &> /dev/null; then
  echo "Docker client is available but not running. Try installing colima"
  # Step 2: Check and install colima if not present
  if ! command_exists colima; then
    echo "Installing colima via Homebrew..."
    brew install colima
  else
    echo "colima is already installed."
  fi
fi

# Step 4: Start Colima (ensure the Docker daemon is running via Colima).
echo "▶️ Starting Colima to launch the Docker runtime (this may take a couple of minutes on first run)..."
if colima start; then
  echo "✅ Colima started successfully."
else
  echo "❌ ERROR: Colima failed to start. Please check the log for details."
  exit 1
fi

docker info