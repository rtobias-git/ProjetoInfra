#!/bin/bash
set -e

DOCKER_USER="tobiasrafaelrosa"

echo "=== Construindo imagem do Backend ==="
docker build -t ${DOCKER_USER}/bookflow-backend:latest ./backend

echo "=== Construindo imagem do Frontend ==="
docker build -t ${DOCKER_USER}/bookflow-frontend:latest ./frontend

echo "=== Enviando imagens para o Docker Hub ==="
docker push ${DOCKER_USER}/bookflow-backend:latest
docker push ${DOCKER_USER}/bookflow-frontend:latest

echo "=== Concluido com sucesso! ==="
