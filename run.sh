#!/bin/bash

environment=$1 # first command line arg is either {dev|prod}
shift # removes the first arg from command line args

# Load environment variables from .env file
set -a
source .env
set +a

case $environment in
  dev)
    echo "Starting local development environment with ngrok..."
    MY_UID="$(id -u)" MY_GID="$(id -g)" BUILD_TARGET=development docker compose --profile dev up --build
    ;;
  prod)
    echo "Building production environment..."
    MY_UID="$(id -u)" MY_GID="$(id -g)" BUILD_TARGET=production docker compose build discord-app
    ;;
  *)
    echo "Usage: $0 {dev|prod}"
    exit 1
    ;;
esac