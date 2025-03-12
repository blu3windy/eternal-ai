#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Function to run a Docker container
run_container() {
  local container_name="$1"
  local image_name="$2"
  local port_mapping="$3"
  echo "Running Docker container: $container_name"
  docker run -d --name "$container_name" -p "$port_mapping" "$image_name"
}

# Function to stop a Docker container
stop_container() {
  local container_name="$1"
  echo "Stopping Docker container: $container_name"
  docker stop "$container_name"
  docker rm "$container_name"
}

# Main script logic
usage() {
  echo "Usage: $0 {run|stop} --container-name <name> [--image-name <name>] [--port-mapping <host:container>]"
  exit 1
}

if [ "$#" -lt 2 ]; then
  usage
fi

action="$1"
shift

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --container-name)
      container_name="$2"
      shift 2
      ;;
    --image-name)
      image_name="$2"
      shift 2
      ;;
    --port-mapping)
      port_mapping="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

case "$action" in
  run)
    if [ -z "$container_name" ] || [ -z "$image_name" ] || [ -z "$port_mapping" ]; then
      usage
    fi
    run_container "$container_name" "$image_name" "$port_mapping"
    ;;
  stop)
    if [ -z "$container_name" ]; then
      usage
    fi
    stop_container "$container_name"
    ;;
  *)
    echo "Invalid action: $action"
    usage
    ;;
esac 