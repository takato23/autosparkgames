// server/socket.dev.js (CommonJS, compatible con package.json type: module mediante require)
/* Levanta Socket.io en :3010 y carga tu lógica existente. */
const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.SOCKET_PORT || 3010
const PATH = process.env.SOCKET_PATH || '/socket.io'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end('socket-ok')
})

const io = new Server(server, {
  path: PATH,
  cors: { origin: true, credentials: false },
})

global.__io = io // Disponible para websocket.js

// Carga opcional de la lógica completa del server para reusar handlers.
// Por defecto la deshabilitamos en dev para evitar conflicto con Next en :3004.
if (process.env.SOCKET_LOAD_WEBSOCKET === 'true') {
  require('./websocket.js')
}

server.listen(PORT, () => {
  console.log(`[socket] listening on http://localhost:${PORT}${PATH}`)
})
