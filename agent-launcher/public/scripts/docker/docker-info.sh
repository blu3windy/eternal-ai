#!/bin/bash

# Get all images in JSON format
get_images() {
  echo "["
  first=true
  
  docker images --format '{{json .}}' | while read -r image; do
    if [ "$first" = true ]; then
      first=false
    else
      echo ","
    fi
    echo "    $image"
  done
  echo "]"
}

# Get containers in JSON format
get_containers() {
  echo "["
  first=true
  
  docker ps -a --format '{{json .}}' | while read -r container; do
    if [ "$first" = true ]; then
      first=false
    else
      echo ","
    fi
    echo "    $container"
  done
  echo "]"
}

get_memory() {
  echo "["
  first=true
    docker stats --no-stream --format "{{json .}}" | while read -r container; do
    if [ "$first" = true ]; then
      first=false
    else
      echo ","
    fi
    echo "    $container"
  done
  echo "]"
}

get_cpu() {
  docker info --format '{{.NCPU}}'
}

# Parse command line arguments
case "$1" in
  "images")
    get_images
    ;;
  "containers")
    get_containers
    ;;
  "memory")
    get_memory
    ;;
  "cpus")
    get_cpu
    ;;
  *)
    echo "Usage: $0 {images|containers}" >&2
    echo "  images      - List all Docker images with usage status" >&2
    echo "  containers  - List all Docker containers with state info" >&2
    echo "  container-memory - List all Docker containers with memory usage info" >&2
    exit 1
    ;;
esac
