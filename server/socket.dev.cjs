// server/socket.dev.cjs
/* Levanta Socket.io en :3010 y carga tu lógica existente si se indica. */
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

// Estado mínimo en memoria para responder a create-session
const presentations = new Map()
const sessions = new Map()

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

io.on('connection', (socket) => {
  socket.on('register-presentation', ({ presentation }) => {
    if (presentation?.id) presentations.set(presentation.id, presentation)
  })

  socket.on('create-session', ({ presentationId, teams }) => {
    // En dev: no exigimos presentación registrada
    const code = genCode()
    const session = {
      id: code,
      code,
      presentationId,
      host: socket.id,
      currentSlideIndex: 0,
      participants: [],
      status: 'waiting',
      slideState: 'show',
      state: 'show',
      tallies: {},
      createdAt: new Date().toISOString(),
    }
    sessions.set(code, session)
    socket.join(`session-${code}`)
    socket.join(`host-${code}`)
    const presentation = presentations.get(presentationId) || null
    socket.emit('session-created', {
      session,
      presentation,
      serverUrl: `http://localhost:${PORT}`,
    })
  })

  socket.on('host-join', ({ code }) => {
    const session = sessions.get(code)
    if (!session) return
    socket.join(`session-${code}`)
    socket.join(`host-${code}`)
    socket.emit('session-created', { session, presentation: presentations.get(session.presentationId) || null })
  })

  socket.on('join-session', ({ code, name }) => {
    const session = sessions.get(code)
    if (!session) {
      socket.emit('error', { message: 'Sesión no encontrada' })
      return
    }
    socket.join(`session-${code}`)
    const totalParticipants = io.sockets.adapter.rooms.get(`session-${code}`)?.size || 0
    io.to(`host-${code}`).emit('audience:update', { totalParticipants })
    io.to(`session-${code}`).emit('audience:update', { totalParticipants })
    socket.emit('joined-session', { session, name })
  })
})

if (process.env.SOCKET_LOAD_WEBSOCKET === 'true') {
  require('./websocket.js')
}

server.listen(PORT, () => {
  console.log(`[socket] listening on http://localhost:${PORT}${PATH}`)
})


