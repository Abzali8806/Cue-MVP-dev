#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start Vite development server directly
const viteProcess = spawn('npx', ['vite', '--host', '--port', '5173'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

viteProcess.on('close', (code) => {
  console.log(`Vite development server exited with code ${code}`);
});

process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
  process.exit();
});