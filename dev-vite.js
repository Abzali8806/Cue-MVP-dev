import { createServer } from 'vite'

const server = await createServer({
  configFile: 'vite.config.ts',
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})

await server.listen()
console.log('Vite dev server running on port 5173')