#!/bin/bash

# AutoSpark Games Development Server
echo "🚀 Starting AutoSpark Games development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Environment file not found. Copying from example..."
    cp .env.example .env.local
    echo "Please update .env.local with your Firebase configuration"
fi

# Start the development server
echo "🌟 Starting Next.js development server on http://localhost:3000"
npm run dev