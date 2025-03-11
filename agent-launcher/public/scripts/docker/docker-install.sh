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

# Function to wait for Docker to be ready
wait_for_docker() {
    local attempts=0
    local max_attempts=30  # 30 seconds timeout
    
    log_message "Waiting for Docker to be ready..."
    while ! docker info &> /dev/null; do
        attempts=$((attempts + 1))
        if [ $attempts -ge $max_attempts ]; then
            return 1
        fi
        sleep 1
    done
    return 0
}

# Step 1: Check and install Homebrew if not present
if ! command_exists brew; then
    log_message "Homebrew not found. Installing Homebrew in $HOME/homebrew..."
    mkdir -p "$HOME/homebrew" && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C "$HOME/homebrew"
    export PATH="$HOME/homebrew/bin:$PATH"
    echo 'export PATH="$HOME/homebrew/bin:$PATH"' >> $HOME/.zshrc
    log_message "Homebrew installed successfully"
else
    log_message "Homebrew is already installed at $(which brew)"
fi

# Step 2: Check and install docker if not present
if ! command_exists docker; then
    log_message "Installing docker via Homebrew..."
    brew install docker
    log_message "Docker CLI installed successfully"
else
    log_message "Docker CLI is already installed"
    
    # First check if Docker is already running
    if docker info &> /dev/null; then
        log_message "Docker is already running successfully"
        exit 0
    fi
    
    # Check if Docker Desktop is installed
    if [ -d "/Applications/Docker.app" ]; then
        log_message "Docker Desktop found. Launching application..."
        
        # Kill any existing Docker Desktop process
        pkill -9 Docker || true
        sleep 2
        
        # Launch Docker Desktop
        open -a Docker
        log_message "Waiting for Docker Desktop to initialize..."
        
        # Wait for Docker to be ready
        if wait_for_docker; then
            log_message "Docker Desktop is running successfully"
            exit 0
        else
            log_error "Docker Desktop failed to start in time"
            log_message "Attempting to stop Docker Desktop before proceeding to Colima..."
            pkill -9 Docker || true
            sleep 2
        fi
    fi
fi

# Step 3: If we get here, we need Colima
log_message "Setting up Colima for Docker runtime..."

# Stop any existing Colima instance
if command_exists colima; then
    log_message "Stopping existing Colima instance..."
    colima stop || true
    sleep 2
fi

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
if colima start; then
    log_message "Colima started successfully"
    
    if wait_for_docker; then
        log_message "Docker setup completed successfully"
        exit 0
    else
        log_error "Docker setup failed - docker info check failed"
        exit 1
    fi
else
    log_error "Colima failed to start"
    exit 1
fi