#!/bin/bash

export PATH="$HOME/homebrew/bin:$PATH"

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
    --type)
      TYPE="$2"
      shift 2
      ;;
    --private-key)
      PRIVATE_KEY="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
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
echo "Type: $TYPE"

DOCKER_BUILD_SOURCE_PATH="$FOLDER_PATH/agents/$CONTAINER_NAME"
echo "Build source path: $DOCKER_BUILD_SOURCE_PATH"

# Function to run a Docker container

cd_docker_build_source_path() {
    cd "$DOCKER_BUILD_SOURCE_PATH" || {
        log_error "Failed to access directory: $DOCKER_BUILD_SOURCE_PATH"
        exit 1
    }
}

run_container_js() {
    docker run -d -v "$FOLDER_PATH/agents/$CONTAINER_NAME/prompt.js":/app/src/prompt.js --network network-agent-external --add-host=localmodel:host-gateway --name "$CONTAINER_NAME" "$IMAGE_NAME"
}

run_container_py() {
    cd_docker_build_source_path
    docker build -t "$IMAGE_NAME" .; docker run --network network-agent-external --add-host=localmodel:host-gateway --name "$CONTAINER_NAME" "$IMAGE_NAME"
}

run_container_custom_prompt() {
    cd_docker_build_source_path
    docker build -t "$IMAGE_NAME" .; docker run --network network-agent-external --add-host=localmodel:host-gateway --name "$CONTAINER_NAME" "$IMAGE_NAME"
}


run_container_custom_ui() {
    cd_docker_build_source_path
    
    docker build -t "$IMAGE_NAME" .; 
    docker run -d -p 0:8080 -e PRIVATE_KEY="$PRIVATE_KEY" --name "$CONTAINER_NAME" "$IMAGE_NAME"
    # Get the assigned port
    ASSIGNED_PORT=$(docker port "$CONTAINER_NAME" 8080/tcp | cut -d ':' -f2)
    log_message "Container $CONTAINER_NAME is running on port: $ASSIGNED_PORT"
}

run_container() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  case "$TYPE" in
    js)
      run_container_js
      ;;
    py)
      run_container_py
      ;;
    custom-ui)
      run_container_custom_ui
      ;;
    custom-prompt)
      run_container_custom_prompt
      ;;
    *)
      log_error "Unsupported code language snippet: $TYPE"
      exit 1
      ;;
  esac

}

# Function to stop a Docker container
stop_container() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
}

get_port() {
  # make sure container is running
  while ! docker ps | grep "$CONTAINER_NAME" > /dev/null; do
    sleep 1 
  done
  # get the assigned port
  PORT=$(docker port "$CONTAINER_NAME" 8080/tcp | cut -d ':' -f2)
  echo "$PORT"
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
    if [ -z "$TYPE" ]; then
        log_error "Missing Code Language Snippet"
    fi
    run_container
    ;;
  stop)
    if [ -z "$CONTAINER_NAME" ]; then
      log_error "Missing Container Name"
    fi
    stop_container
    ;;
  get-port)
    if [ -z "$CONTAINER_NAME" ]; then
      log_error "Missing Container Name"
    fi
    get_port
    ;;
  *)
    log_error "Invalid action: $action"
    exit 1
    ;;
esac