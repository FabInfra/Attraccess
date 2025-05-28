#!/bin/bash

echo "Installing pnpm..."
npm install -g pnpm

echo "Installing node modules..."
pnpm install

echo "Installing PlatformIO Core..."
pip3 install -U platformio

echo "Setup complete."
