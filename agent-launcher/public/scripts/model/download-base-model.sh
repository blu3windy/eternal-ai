#!/bin/bash

# Logging functions
log_message() {
    local message="$1"
    echo "[LAUNCHER_LOGGER] [MODEL_INSTALL] --name MODEL_DOWNLOAD --message \"$message\""
}

log_error() {
    local message="$1"
    echo "[LAUNCHER_LOGGER] [MODEL_INSTALL] --name MODEL_DOWNLOAD --error \"$message\"" >&2
}

# Function to filter and log output
filter_and_log() {
    while IFS= read -r line; do
        echo "$line"  # Print the line to stdout
        if [[ $line == *"[MODEL_INSTALL]"* ]]; then
            # Check if it's a progress message
            if [[ $line =~ --step\ ([0-9]+)-([0-9]+)\ --hash\ (.*) ]]; then
                # Extract the numbers and add 2 to total
                current="${BASH_REMATCH[1]}"
                base_total="${BASH_REMATCH[2]}"
                total=$((base_total + 2))
                
                # Calculate percentage with 5% minimum
                if [ "$current" -eq 0 ]; then
                    percentage=5
                else
                    percentage=$(awk "BEGIN { printf \"%.0f\", (($current * 98) / $total) + 2 }")
                fi

                # Create fancy progress message
                # progress_bar="▰▰▰▱▱▱▱▱▱▱"  # Example progress bar
                log_message "⚡ Downloading model... ${percentage}% | ${current}/${total} files"
            else
                log_message "$line"
            fi
        fi

        #MODEL_INSTALL_LLAMA
        if [[ $line == *"[MODEL_INSTALL_LLAMA]"* ]]; then
            if [[ $line == *"--error"* ]]; then
                # Extract error message between quotes
                if [[ $line =~ --error\ \"([^\"]*)\" ]]; then
                    log_error "${BASH_REMATCH[1]}"
                fi
            elif [[ $line == *"--message"* ]]; then
                # Extract message between quotes
                if [[ $line =~ --message\ \"([^\"]*)\" ]]; then
                    log_message "${BASH_REMATCH[1]}"
                fi
            fi
        fi
    done
}

# Parse command line arguments
FOLDER_PATH=""
MODEL_HASH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --folder-path)
            FOLDER_PATH="$2"
            shift 2
            ;;
        --hash)
            MODEL_HASH="$2"
            shift 2
            ;;
        *)
            log_error "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Quick parameter validation
if [ -z "$FOLDER_PATH" ] || [ -z "$MODEL_HASH" ]; then
    log_error "Missing required parameters"
    exit 1
fi

# Change to target directory
cd "$FOLDER_PATH" || {
    log_error "Failed to change directory to: $FOLDER_PATH"
    exit 1
}

log_message "Working in directory: $(pwd)"

# Execute mac.sh first
log_message "Running mac.sh setup..."
bash ./mac.sh 2>&1 | filter_and_log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_error "mac.sh setup failed"
    exit 1
fi

# Check for virtual environment
if [ ! -f "./local_llms/bin/activate" ] && [ ! -f "$(pwd)/local_llms/bin/activate" ]; then
    log_error "Virtual environment not found"
    exit 1
fi

# Single attempt with environment check
(
    set -o pipefail
    # Try relative path first, fallback to absolute
    if [ -f "./local_llms/bin/activate" ]; then
        source ./local_llms/bin/activate
    else
        source "$(pwd)/local_llms/bin/activate"
    fi
    
    exec 2>&1  # Redirect stderr to stdout
    
    # Run commands
    if local-llms download --hash "${MODEL_HASH}"; then
        local-llms start --hash "${MODEL_HASH}"
    fi
) | filter_and_log

# Check final status
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    log_message "Model setup completed successfully"
    exit 0
else
    log_error "Model setup failed"
    exit 1
fi