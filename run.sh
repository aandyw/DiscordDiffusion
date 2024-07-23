#!/bin/bash

environment=$1 # first command line arg is either {dev|prod}
shift # removes the first arg from command line args

# Load environment variables from .env file
set -a
source .env
set +a

case $environment in
  dev)
    echo "Starting development environment with ngrok..."
    MY_UID="$(id -u)" MY_GID="$(id -g)" docker compose --profile dev up --build
    ;;
  prod)
    echo "Starting production environment..."
    MY_UID="$(id -u)" MY_GID="$(id -g)" docker compose up discord-app --build
    ;;
  *)
    echo "Usage: $0 {dev|prod}"
    exit 1
    ;;
esac