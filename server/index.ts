import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import { createServer } from 'http';

const app = express();
const VITE_PORT = 5174;

console.log('Starting Cue Frontend - FastAPI Integration Mode');
console.log('All backend logic will be handled by your FastAPI server');

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

// Create proxy middleware for Vite
const proxy = createProxyMiddleware({
  target: `http://localhost:${VITE_PORT}`,
  changeOrigin: true,
  ws: true
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    mode: 'fastapi-integration',
    timestamp: new Date().toISOString() 
  });
});

// Proxy all requests to Vite (no API routes - FastAPI handles those)
app.use(proxy);

// Wait for Vite to start, then start the server
setTimeout(async () => {
  try {
    const availablePort = await findAvailablePort(5000);
    app.listen(availablePort, '0.0.0.0', () => {
      console.log(`✓ Frontend server running on http://0.0.0.0:${availablePort}`);
      console.log(`✓ Vite dev server running on port ${VITE_PORT}`);
      console.log(`⚠ Configure VITE_API_BASE_URL to point to your FastAPI backend`);
      console.log(`⚠ FastAPI should handle all /api/* routes and authentication`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
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