import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import { createServer } from 'http';

const app = express();
const VITE_PORT = 5174; // Changed to avoid port conflicts

console.log('Starting Cue MVP Frontend...');

// Start Vite dev server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', VITE_PORT.toString()], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

// Function to find available port
function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, '0.0.0.0', () => {
      const port = (server.address() as any)?.port || startPort;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Wait for Vite to start, then set up proxy
setTimeout(async () => {
  app.use('/', createProxyMiddleware({
    target: `http://localhost:${VITE_PORT}`,
    changeOrigin: true,
    ws: true
  }));

  try {
    const availablePort = await findAvailablePort(5000);
    app.listen(availablePort, '0.0.0.0', () => {
      console.log(`Proxy server running on http://0.0.0.0:${availablePort}`);
      console.log(`Proxying to Vite dev server on port ${VITE_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}, 3000);

// Add health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

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