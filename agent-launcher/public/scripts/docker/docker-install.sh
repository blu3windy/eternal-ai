#!/bin/bash
set -x 
export PATH="/opt/homebrew/bin/:$PATH"
export PATH="$HOME/homebrew/bin:$PATH"
export PATH="/usr/local/bin:$PATH"

# Logging function
log_message() {
    local message="$1"
    echo "[LAUNCHER_LOGGER] [INITIALIZE] --name [DOCKER_INSTALL] --message \"$message\""
}

# Error logging function
log_error() {
    local message="$1"
    echo "[LAUNCHER_LOGGER] [INITIALIZE] --name [DOCKER_INSTALL] --error \"$message\"" >&2
}

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Step 1: Check and install Homebrew if not present
if ! command_exists brew; then
    log_message "Homebrew not found. Installing Homebrew in $HOME/homebrew..."
    mkdir -p "$HOME/homebrew" && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C "$HOME/homebrew"
    export PATH="$HOME/homebrew/bin:$PATH"

    log_message "Homebrew installed successfully"
else
    log_message "Homebrew is already installed at $(which brew)"
fi

# Step 2: Check and install docker if not present
if ! command_exists docker; then
    log_message "Installing docker via Homebrew..."
    brew install docker
    brew install docker-credential-helper
    log_message "Docker CLI installed successfully"
else
    log_message "Docker CLI is already installed"

    # First check if Docker is already running
    if docker ps &> /dev/null; then
        log_message "Docker is already running successfully"
        exit 0
    fi

    # Check if Docker Desktop is installed
    if [ -d "/Applications/Docker.app" ]; then
        log_message "Docker Desktop found. Launching application..."

        # Launch Docker Desktop
        open -a Docker
        log_message "Waiting for Docker Desktop to initialize..."
        sleep 20
        exit 0
    fi
fi

# Step 3: If we get here, we need Colima
log_message "Setting up Colima for Docker runtime..."

# Stop any existing Colima instance
#if command_exists colima; then
#    log_message "Stopping existing Colima instance..."
#    colima stop || true
#    sleep 2
#fi

# Install Colima if needed
if ! command_exists colima; then
    log_message "Installing Colima via Homebrew..."
    brew install colima
    log_message "Colima installation completed"
else
    log_message "Colima is already installed"
fi

# Step 4: Start Colima
log_message "Starting Colima Docker runtime..."
if colima start --cpu 4 --memory 6; then
    log_message "Colima started successfully"

else
    log_error "Colima failed to start"
    exit 1
fi