#!/bin/bash

# Kill any existing processes on port 3010
echo "🔍 Checking for processes on port 3010..."
lsof -ti:3010 | xargs kill -9 2>/dev/null || echo "No processes found on port 3010"

# Wait a moment for processes to fully terminate
sleep 1

# Start Next.js development server on port 3010
echo "🚀 Starting Next.js development server on port 3010..."
PORT=3010 npm run dev
