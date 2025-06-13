#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Starting Cue MVP Frontend...');

const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  stdio: 'inherit',
  shell: true
});

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  vite.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  vite.kill('SIGTERM');
});