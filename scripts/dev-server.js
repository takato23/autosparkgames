#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AutoSpark Games development server...');

// Start the Next.js + WebSocket server
const serverPath = path.join(__dirname, '..', 'server', 'websocket.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Handle server exit
server.on('exit', (code, signal) => {
  if (code !== null) {
    console.log(`📤 Server exited with code ${code}`);
  } else if (signal !== null) {
    console.log(`📤 Server was killed with signal ${signal}`);
  }
});

// Pass through termination signals
['SIGTERM', 'SIGINT', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n📥 Received ${signal}, stopping server...`);
    server.kill(signal);
  });
});

// Keep the script running
process.stdin.resume();