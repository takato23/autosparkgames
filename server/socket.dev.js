// server/socket.dev.js (CommonJS, compatible con package.json type: module mediante require)
/* Levanta Socket.io en :3010 y carga tu lógica existente. */
const http = require('http')
const { Server } = require('socket.io')
const { registerSocketHandlers } = require('./websocket.js')

const PORT = Number(process.env.SOCKET_PORT || 3010)
const PATH = process.env.SOCKET_PATH || '/socket.io'

// Guard against HMR double-init
if (global.__io) {
  try { global.__io.close() } catch {}
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end('socket-ok')
})

const io = new Server(server, {
  path: PATH,
  cors: {
    origin: /localhost:\d+$/,
    methods: ['GET', 'POST'],
    credentials: false,
  },
})

global.__io = io

// Reuse the same handlers as production
registerSocketHandlers(io, { prefixLog: '[socket.dev]' })

server.listen(PORT, () => {
  console.log(`[socket] listening on http://localhost:${PORT}${PATH}`)
})
