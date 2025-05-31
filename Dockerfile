# Multi-stage Dockerfile for Nx monorepo
# This Dockerfile is intended to be built using the build.sh script 
# which will read Node version from .nvmrc

# Define ARG before FROM so it can be used in FROM
ARG NODE_VERSION=20.10.0

# Build stage for FabReader firmware
FROM python:3.9-slim AS firmware-builder

# Install required dependencies for building firmware
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install PlatformIO
RUN pip install platformio

# Set working directory
WORKDIR /firmware

# Copy firmware source
COPY ./apps/fabreader-firmware ./

# Build firmware
RUN platformio run -e fabreader

# Create firmware directory for output files
RUN mkdir -p /firmware_output

# Copy firmware files to output directory
RUN cp .pio/build/fabreader/firmware.bin /firmware_output/ && \
    cp .pio/build/fabreader/bootloader.bin /firmware_output/ && \
    cp .pio/build/fabreader/partitions.bin /firmware_output/

# Create manifest.json
RUN echo '{ \
    "name": "FabReader", \
    "version": "'$(grep -oP 'version\s*=\s*"\K[^"]*' platformio.ini || echo "1.0.0")'", \
    "builds": [ \
    { \
    "chipFamily": "ESP32", \
    "parts": [ \
    { "path": "_fabreader_assets/bootloader.bin", "offset": 4096 }, \
    { "path": "_fabreader_assets/partitions.bin", "offset": 32768 }, \
    { "path": "_fabreader_assets/firmware.bin", "offset": 65536 } \
    ] \
    } \
    ] \
    }' > /firmware_output/manifest.json

# Single-stage Dockerfile that only copies pre-built artifacts
FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /app

# Copy the pre-built application (these will be built in the CI pipeline)
COPY ./dist/apps/api ./dist/apps/api
COPY ./dist/apps/frontend ./dist/apps/frontend
COPY ./docs ./docs

# Copy firmware files from builder stage
COPY --from=firmware-builder /firmware_output/ ./dist/apps/frontend/_fabreader_assets/

COPY package.json package.json

# Set environment variable to tell API about frontend location
ENV STATIC_FRONTEND_FILE_PATH=/app/dist/apps/frontend

# Set environment variable to tell API about docs location
ENV STATIC_DOCS_FILE_PATH=/app/docs

# Set environment variable to tell API about plugins location
RUN mkdir -p /app/storage/plugins
ENV STORAGE_ROOT=/app/storage
ENV PLUGIN_DIR=/app/storage/plugins

# Install dependencies directly from the Nx-generated package.json
WORKDIR /app/dist/apps/api
RUN corepack enable && corepack prepare && \
    pnpm install # --frozen-lockfile

# Back to app root for consistent starting dir
WORKDIR /app

# Expose the API port
EXPOSE 3000

# Start the API using the launch script
CMD ["node", "dist/apps/api/main.js"]
