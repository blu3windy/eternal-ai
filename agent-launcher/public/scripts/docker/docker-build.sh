#!/bin/bash
export PATH="/opt/homebrew/bin/:$PATH"
export PATH="$HOME/homebrew/bin:$PATH"
export PATH="/usr/local/bin:$PATH"

# Logging functions
log_message() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [DOCKER_BUILD] --name DOCKER_BUILD --message \"$message\""
    fi
}

log_error() {
    local message="$1"
    if [[ -n "${message// }" ]]; then
        echo "[LAUNCHER_LOGGER] [DOCKER_BUILD] --name DOCKER_BUILD --error \"$message\"" >&2
    fi
}

# Parse command line arguments
FOLDER_PATH=""
DOCKER_CONTAINERS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        --folder-path)
            FOLDER_PATH="$2"
            shift 2
            ;;
        --container)
            DOCKER_CONTAINERS+=("$2")
            shift 2
            ;;
        *)
            log_error "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Validate parameters
if [ -z "$FOLDER_PATH" ]; then
    log_error "Missing required parameter: --folder-path"
    exit 1
fi

if [ ${#DOCKER_CONTAINERS[@]} -eq 0 ]; then
    DOCKER_CONTAINERS=(
        "agent-router:agent-router:33030"
    )
fi

# Change to target directory
cd "$FOLDER_PATH" || {
    log_error "Failed to access directory: $FOLDER_PATH"
    exit 1
}


# Create network silently
docker network create network-agent-external || true
docker network create --internal network-agent-internal || true

# Track overall success and running containers
build_success=true
declare -a running_containers=()

# Loop through container configurations
for container in "${DOCKER_CONTAINERS[@]}"; do
    IFS=':' read -r folder_name container_name port <<< "$container"
    
    log_message "Building $container_name..."
    
    # Check folder and Dockerfile
    if [ ! -d "./${folder_name}" ] || [ ! -f "./${folder_name}/Dockerfile" ]; then
        log_error "Missing required files for $container_name"
        build_success=false
        continue
    fi
    
    # Build image
    if ! docker build -t "${container_name}" "./${folder_name}"; then
        log_error "Failed to build $container_name"
        build_success=false
        continue
    fi
    
    log_message "Built $container_name successfully"

    # Stop and remove silently
    docker stop "${container_name}" || true
    docker rm "${container_name}" || true

    docker stop "launcher-agent-router" || true
    docker rm "launcher-agent-router" || true

    # Run new container if it has a port
    if [ -n "$port" ]; then
        log_message "Starting $container_name..."
        if [ "$container_name" = "agent-router" ]; then
            if ! docker run -d -p "${port}:80" --network=network-agent-external --network=network-agent-internal --add-host=localmodel:host-gateway --name "${container_name}" -v "${FOLDER_PATH}/${container_name}/data:/app/data" "${container_name}"; then
                log_error "Failed to start $container_name with mount"
                build_success=false
                continue
            fi
        else
            if ! docker run -d -p "${port}:80" --network=network-agent-external --network=network-agent-internal --add-host=localmodel:host-gateway --name "${container_name}" "${container_name}"; then
                log_error "Failed to start $container_name"
                build_success=false
                continue
            fi
        fi
        log_message "Started $container_name successfully"
        running_containers+=("$container_name:$port")
    else
        running_containers+=("$container_name:none")
    fi
done

if [ "$build_success" = true ]; then
    log_message "All containers ready"
    
    # Show running containers status
    for container in "${running_containers[@]}"; do
        IFS=':' read -r name port <<< "$container"
        if [ "$port" = "none" ]; then
            log_message "• $name (built)"
        else
            log_message "• $name (running on port $port)"
        fi
    done

    # log_message "Pulling agent-base-node..."
    # docker pull eternalpersonalagi/agent-base-node
    # log_message "Pulling agent-base-node done"


    # log_message "Pulling agent-base-python..."
    # docker pull eternalpersonalagi/agent-base-python
    # log_message "Pulling agent-base-python done"

    exit 0
else
    log_error "Setup failed"
    exit 1
fi