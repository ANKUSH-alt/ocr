#!/bin/bash

# Configuration
PORT=8000
BINARY_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz"
BINARY_DIR="./bin"
BINARY_PATH="$BINARY_DIR/cloudflared"

echo "📡 Setting up Secure Cloudflare Tunnel for OCR Backend..."

# Create binary directory
mkdir -p "$BINARY_DIR"

# Download cloudflared if not present
if [ ! -f "$BINARY_PATH" ]; then
    echo "📥 Downloading cloudflared for Mac..."
    curl -L "$BINARY_URL" -o "$BINARY_DIR/cloudflared.tgz"
    tar -xzf "$BINARY_DIR/cloudflared.tgz" -C "$BINARY_DIR"
    rm "$BINARY_DIR/cloudflared.tgz"
    chmod +x "$BINARY_PATH"
fi

echo "🚀 Starting Tunnel to port $PORT..."
echo ""
echo "--------------------------------------------------------"
echo "👉 COPY THE 'trycloudflare.com' URL FROM THE LOGS BELOW"
echo "--------------------------------------------------------"
echo ""

# Start tunnel
"$BINARY_PATH" tunnel --url "http://localhost:$PORT"
