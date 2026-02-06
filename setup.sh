#!/bin/bash

# Setup script for ArchMaps Shop on arm64/PRoot

echo "--- Starting Setup for ArchMaps Shop ---"

# 1. Server Setup
echo "Configuring Server..."
cd server
rm -rf node_modules package-lock.json
npm cache clean --force

# Suggesting build tools for better-sqlite3 compilation
if [ -f /etc/debian_version ]; then
    echo "Tip: If compilation fails, ensure you have build tools installed:"
    echo "sudo apt-get update && sudo apt-get install -y build-essential python3 python3-gyp"
fi

echo "Installing server dependencies..."
npm install || { echo "Server install failed. Trying with --no-bin-links..."; npm install --no-bin-links; }

cd ..

# 2. Client Setup
echo "Configuring Client..."
cd client
rm -rf node_modules package-lock.json
npm cache clean --force

echo "Installing client dependencies..."
npm install || { echo "Client install failed. Trying with --no-bin-links..."; npm install --no-bin-links; }

cd ..

echo "--- Setup Complete ---"
echo "To start the app:"
echo "1. In server directory: npm start"
echo "2. In client directory: npm run dev"
