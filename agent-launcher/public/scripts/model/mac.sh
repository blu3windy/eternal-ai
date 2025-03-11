#!/bin/bash
set -o pipefail

# Logging functions
log_message() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [MODEL_INSTALL_LLAMA] --message \"$message\""
    fi
}

log_error() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [MODEL_INSTALL_LLAMA] --error \"$message\"" >&2
    fi
}

# Error handling function
handle_error() {
    local exit_code=$1
    local error_msg=$2
    log_error "$error_msg"

    # Clean up if needed
    if [[ -n "$VIRTUAL_ENV" ]]; then
        log_message "Deactivating virtual environment..."
        deactivate 2>/dev/null || true
    fi

    exit $exit_code
}

command_exists() {
    command -v "$1" &> /dev/null
}

# Step 1: Check and install Homebrew if not present
if ! command_exists brew; then
    export PATH="$HOME/homebrew/bin:$PATH"
fi

# Step 2: Install or Update Python
log_message "Checking Python installation..."
if command_exists python3; then
    log_message "Python is already installed"
else
    log_message "Installing Python..."
    brew install python || handle_error $? "Failed to install Python"
fi

python3 --version > /dev/null 2>&1 || handle_error $? "Python installation verification failed"
log_message "Python setup complete"

# Step 3: Update PATH in .zshrc
if ! grep -q 'export PATH="/opt/homebrew/bin:\$PATH"' ~/.zshrc; then
    cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d%H%M%S) || handle_error $? "Failed to backup .zshrc"
    echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc || handle_error $? "Failed to update .zshrc"
    log_message "Updated PATH in .zshrc"
fi

# Step 4: Install pigz
log_message "Installing pigz..."
brew install pigz > /dev/null 2>&1 || handle_error $? "Failed to install pigz"
log_message "Pigz installed successfully"

# Step 5: Create and activate Python virtual environment
log_message "Setting up Python environment..."
python3 -m venv local_llms || handle_error $? "Failed to create virtual environment"

if [ -f "local_llms/bin/activate" ]; then
    source local_llms/bin/activate || handle_error $? "Failed to activate virtual environment"
    log_message "Virtual environment activated"
else
    handle_error 1 "Virtual environment setup failed"
fi

# Step 6: Install llama.cpp
log_message "Installing llama.cpp..."
brew install llama.cpp > /dev/null 2>&1 || handle_error $? "Failed to install llama.cpp"

hash -r
llama-cli --version > /dev/null 2>&1 || handle_error $? "llama.cpp verification failed"
log_message "llama.cpp installed successfully"

# Step 7: Set up local-llms toolkit
log_message "Installing local-llms toolkit..."
pip3 uninstall local-llms -y > /dev/null 2>&1 || true
pip3 install -q git+https://github.com/eternalai-org/local-llms.git > /dev/null 2>&1 || handle_error $? "Failed to install local-llms toolkit"
log_message "local-llms toolkit installed successfully"

log_message "Setup completed successfully"