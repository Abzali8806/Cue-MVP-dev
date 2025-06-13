import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

const app = express();
const PORT = 5000;
const VITE_PORT = 5173;

console.log('Starting Cue MVP Frontend...');

// Start Vite dev server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', VITE_PORT.toString()], {
  stdio: 'pipe',
  shell: true,
  cwd: process.cwd()
});

vite.stdout?.on('data', (data) => {
  console.log(data.toString());
});

vite.stderr?.on('data', (data) => {
  console.error(data.toString());
});

// Wait for Vite to start, then set up proxy
setTimeout(() => {
  app.use('/', createProxyMiddleware({
    target: `http://localhost:${VITE_PORT}`,
    changeOrigin: true,
    ws: true
  }));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
    console.log(`Proxying to Vite dev server on port ${VITE_PORT}`);
  });
}, 3000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  vite.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  vite.kill('SIGTERM');
  process.exit(0);
});