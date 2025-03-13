#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Logging functions
log_message() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [DOCKER_ACTION] --name DOCKER_ACTION --message \"$message\""
    fi
}

log_error() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [DOCKER_ACTION] --name DOCKER_ACTION --error \"$message\"" >&2
    fi
}

if [ "$#" -lt 2 ]; then
  log_error "Missing required parameters"
fi

action="$1"
shift

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --container-name)
      CONTAINER_NAME="$2"
      shift 2
      ;;
    --image-name)
      IMAGE_NAME="$2"
      shift 2
      ;;
    --folder-path)    
      FOLDER_PATH="$2"
      shift 2
      ;;
    --code-language-snippet)    
      CODE_LANGUAGE_SNIPPET="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Change to target directory
cd "$FOLDER_PATH" || {
    log_error "Failed to access directory: $FOLDER_PATH"
    exit 1
}

log_message "Current working directory: $FOLDER_PATH"

echo "Container Name: $CONTAINER_NAME"
echo "Image Name: $IMAGE_NAME"
echo "Folder Path: $FOLDER_PATH"
echo "Code Language Snippet: $CODE_LANGUAGE_SNIPPET"

# Function to run a Docker container
run_container() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  docker run -d -v "$FOLDER_PATH/agents/84532-BTT01/prompt.$CODE_LANGUAGE_SNIPPET":/app/src/prompt.$CODE_LANGUAGE_SNIPPET --network network-agent-external --add-host=localmodel:host-gateway --name $CONTAINER_NAME $IMAGE_NAME
}

# Function to stop a Docker container
stop_container() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
}


case "$action" in
  run)
    if [ -z "$CONTAINER_NAME" ]; then
        log_error "Missing Container Name"
    fi
    if [ -z "$IMAGE_NAME" ]; then
        log_error "Missing Image Name"
    fi
    if [ -z "$FOLDER_PATH" ]; then
        log_error "Missing Folder Path"
    fi
    if [ -z "$CODE_LANGUAGE_SNIPPET" ]; then
        log_error "Missing Code Language Snippet"
    fi
    run_container "$CONTAINER_NAME" "$IMAGE_NAME" "$FOLDER_PATH" "$CODE_LANGUAGE_SNIPPET"
    ;;
  stop)
    if [ -z "$CONTAINER_NAME" ]; then
      log_error "Missing Container Name"
    fi
    stop_container "$container_name"
    ;;
  *)
    log_error "Invalid action: $action"
    exit 1
    ;;
esac