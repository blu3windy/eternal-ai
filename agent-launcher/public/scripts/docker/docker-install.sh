#!/bin/bash

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
    log_message "Homebrew not found. Starting installation..."
    mkdir -p "$HOME/homebrew" && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C "$HOME/homebrew"
    export PATH="$HOME/homebrew/bin:$PATH"
    echo 'export PATH="$HOME/homebrew/bin:$PATH"' >> $HOME/.zshrc
    log_message "Homebrew installed successfully"
else
    log_message "Homebrew already installed at $(which brew)"
fi

# Step 2: Check and install docker if not present
if ! docker; then
    log_message "Docker not found. Installing via Homebrew..."
    brew install docker
    log_message "Docker installation completed"
else
    log_message "Docker is already installed"
    # Check if Docker Desktop is installed
    if [ -d "/Applications/Docker.app" ]; then
        log_message "Docker Desktop found. Launching application..."
        open -a Docker
        sleep 5
        log_message "Docker Desktop launched"
    else
        log_message "Docker Desktop not installed"
    fi
fi

# Step 3: Check and install colima
if ! docker info &> /dev/null; then
    log_message "Docker daemon not running. Checking Colima..."
    # Check and install colima if not present
    if ! command_exists colima; then
        log_message "Installing Colima via Homebrew..."
        brew install colima
        log_message "Colima installation completed"
    else
        log_message "Colima already installed"
    fi
fi

## Step 4: Start Colima
#log_message "Starting Colima Docker runtime..."
#if colima start; then
#    log_message "Colima started successfully"
#else
#    log_error "Colima failed to start"
#    exit 1
#fi

# Final Docker check
if docker info &> /dev/null; then
    log_message "Docker setup completed successfully"
else
    log_error "Docker setup failed - docker info check failed"
    exit 1
fi