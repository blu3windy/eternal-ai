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

# Parse command line arguments
case "$1" in
  "images")
    get_images
    ;;
  "containers")
    get_containers
    ;;
  *)
    echo "Usage: $0 {images|containers}" >&2
    echo "  images      - List all Docker images with usage status" >&2
    echo "  containers  - List all Docker containers with state info" >&2
    exit 1
    ;;
esac
