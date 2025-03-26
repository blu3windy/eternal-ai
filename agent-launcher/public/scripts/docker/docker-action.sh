#!/bin/bash

export PATH="/opt/homebrew/bin/:$PATH"
export PATH="$HOME/homebrew/bin:$PATH"

DEFAULT_PORT=65534

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
    --wallet-address)
      WALLET_ADDRESS="$2"
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
    log_message "Current working directory: $DOCKER_BUILD_SOURCE_PATH"
}

run_container_custom_prompt() {
    cd_docker_build_source_path
    docker build -t "$IMAGE_NAME" .;
    if [ -n "$PORT" ]; then
    docker run -d "${PORT}" --network network-agent-external --add-host=localmodel:host-gateway --name "$CONTAINER_NAME" "$IMAGE_NAME"
    else
        docker run -d --network network-agent-external --add-host=localmodel:host-gateway --name "$CONTAINER_NAME" "$IMAGE_NAME"
    fi
}

run_container_open_ai() {
    cd_docker_build_source_path
    docker build -t "$IMAGE_NAME" .;
    docker run -d -p $DEFAULT_PORT:$DEFAULT_PORT --network network-agent-external --name "$CONTAINER_NAME" "$IMAGE_NAME"
}

run_container_custom_ui() {
    cd_docker_build_source_path
    docker build -t "$IMAGE_NAME" .;
    docker run -d -p 0:8080 --network network-agent-external -e PRIVATE_KEY="$PRIVATE_KEY" -e WALLET_ADDRESS="$WALLET_ADDRESS" --name "$CONTAINER_NAME" "$IMAGE_NAME"
}

run_container() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  case "$TYPE" in
    custom-ui)
      run_container_custom_ui
      ;;
    custom-prompt)
      run_container_custom_prompt
      ;;
    open-ai)
      run_container_open_ai
      ;;
    *)
      log_error "Unsupported code this type: $TYPE"
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
  # Set a timeout of 30 seconds
  local timeout=5
  local counter=0
  
  # Check for container with timeout
  while ! docker ps | grep "$CONTAINER_NAME" > /dev/null; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
      echo "Error: Container $CONTAINER_NAME not found after $timeout seconds" >&2
      exit 1
    fi
  done
  
  # get the assigned port
  PORT=$(docker port "$CONTAINER_NAME" 8080/tcp | cut -d ':' -f2)
  echo "$PORT"
}

delete() {
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  docker rmi "$IMAGE_NAME" 2>/dev/null || true
}

set_ready_port() {
    local port="$1"
    log_message "Checking for containers using port $port..."
    
    # Find containers using port DEFAULT_PORT
    local containers=$(docker ps -q --filter "publish=$port")
    
    if [ -n "$containers" ]; then
        log_message "Found containers using port $port. Stopping them..."
        for container in $containers; do
            local container_name=$(docker inspect --format '{{.Name}}' "$container" | sed 's/\///')
            log_message "Stopping container: $container_name"
            docker stop "$container" || {
                log_error "Failed to stop container: $container_name"
                return 1
            }
            docker rm "$container" || {
                log_error "Failed to remove container: $container_name"
                return 1
            }
        done
        log_message "Successfully stopped all containers using port $port"
    else
        log_message "No containers found using port $port"
    fi
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
  delete)
    if [ -z "$CONTAINER_NAME" ]; then
      log_error "Missing Container Name"
    fi
    if [ -z "$IMAGE_NAME" ]; then
      log_error "Missing Image Name"
    fi
    delete
    ;;
  set-ready-port)
    set_ready_port "$DEFAULT_PORT"
    ;;
  *)
    log_error "Invalid action: $action"
    exit 1
    ;;
esac