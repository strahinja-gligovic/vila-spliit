#!/bin/bash

# Set the directory where your docker-compose.yml is located
COMPOSE_DIR="/home/strah/projects/vila-spliit/compose.yaml"

# Navigate to the directory
cd $COMPOSE_DIR

# Optional: Pull the latest changes from your git repository
git pull

# Rebuild the images
docker-compose build --no-cache

# Redeploy the containers
docker-compose up -d

# Display the status of the containers
docker-compose ps

echo "Docker containers have been rebuilt and redeployed."
