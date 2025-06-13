#!/usr/bin/env node
import { createServer } from 'vite';

const server = await createServer({
  root: '.',
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});

await server.listen();
server.printUrls();