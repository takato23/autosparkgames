const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')
const ip = require('ip')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3004

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Solo iniciar servidores si este archivo es el entrypoint directo
if (require.main === module) {
  // Usa el io inyectado por server/socket.dev.js si existe; si no, crea uno standalone
  let io = global.__io
  if (!io) {
    const http = require('http')
    const server = http.createServer((req, res) => res.end('socket-standalone'))
    const PORT = process.env.SOCKET_PORT || 3010
    const PATH = process.env.SOCKET_PATH || '/socket.io'
    io = new Server(server, { path: PATH, cors: { origin: true, credentials: false } })
    server.listen(PORT, () => console.log(`[socket-standalone] on :${PORT}${PATH}`))
  }
}

// Game state stored in memory
let gameState = {
  sessions: new Map(),
  presentations: new Map(),
  users: new Map(), // Track connected users
  rateLimits: new Map(), // Rate limiting per socket
  collaborations: new Map(), // Track collaborative editing sessions
}

// Rate limiting configuration
const RATE_LIMITS = {
  messages: { max: 100, window: 60000 }, // 100 messages per minute
  actions: { max: 30, window: 60000 }, // 30 actions per minute
}

// Initialize demo presentations
function initializeDemoPresentations() {
  const demoTrivia = {
    id: 'demo-trivia-1',
    title: 'Trivia de Conocimiento General',
    type: 'quiz',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: '¡Bienvenidos al Trivia! 🎯',
        subtitle: 'Prepárense para poner a prueba su conocimiento'
      },
      {
        id: 'slide-2',
        type: 'trivia',
        question: '¿Cuál es la capital de Francia?',
        options: [
          { id: '1', text: 'Londres' },
          { id: '2', text: 'París' },
          { id: '3', text: 'Berlín' },
          { id: '4', text: 'Madrid' }
        ],
        correctAnswer: '2',
        points: 100,
        timeLimit: 20
      },
      {
        id: 'slide-3',
        type: 'trivia',
        question: '¿En qué año llegó el hombre a la luna?',
        options: [
          { id: '1', text: '1967' },
          { id: '2', text: '1968' },
          { id: '3', text: '1969' },
          { id: '4', text: '1970' }
        ],
        correctAnswer: '3',
        points: 150,
        timeLimit: 20
      },
      {
        id: 'slide-4',
        type: 'poll',
        question: '¿Qué tema te gustaría para el próximo trivia?',
        options: [
          { id: '1', text: 'Historia' },
          { id: '2', text: 'Ciencia' },
          { id: '3', text: 'Deportes' },
          { id: '4', text: 'Arte' }
        ]
      },
      {
        id: 'slide-5',
        type: 'word-cloud',
        question: '¿Qué palabra describe mejor esta experiencia?',
        maxWords: 3
      },
      {
        id: 'slide-6',
        type: 'leaderboard',
        title: '¡Resultados Finales! 🏆'
      }
    ]
  }

  const demoGame = {
    id: 'demo-game-1',
    title: 'Juegos Interactivos',
    type: 'game',
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: '¡Hora de Jugar! 🎮',
        subtitle: 'Preparados para divertirse'
      },
      {
        id: 'slide-2',
        type: 'game',
        gameType: 'word-puzzle',
        title: 'Encuentra la palabra',
        word: 'TECNOLOGIA',
        hint: 'Lo que hace posible esta presentación',
        points: 200,
        timeLimit: 60
      },
      {
        id: 'slide-3',
        type: 'game',
        gameType: 'memory-game',
        title: 'Juego de memoria',
        pairs: 6,
        theme: 'emojis',
        points: 300,
        timeLimit: 90
      }
    ]
  }
  
  gameState.presentations.set(demoTrivia.id, demoTrivia)
  gameState.presentations.set(demoGame.id, demoGame)
}

// Rate limiting middleware
function checkRateLimit(socketId, type = 'messages') {
  const now = Date.now()
  const limit = RATE_LIMITS[type]
  
  if (!gameState.rateLimits.has(socketId)) {
    gameState.rateLimits.set(socketId, {})
  }
  
  const userLimits = gameState.rateLimits.get(socketId)
  
  if (!userLimits[type]) {
    userLimits[type] = { count: 0, resetTime: now + limit.window }
  }
  
  // Reset if window has passed
  if (now > userLimits[type].resetTime) {
    userLimits[type] = { count: 0, resetTime: now + limit.window }
  }
  
  // Check if limit exceeded
  if (userLimits[type].count >= limit.max) {
    return false
  }
  
  userLimits[type].count++
  return true
}

// Validate session code
function validateSessionCode(code) {
  return /^\d{6}$/.test(code)
}

// Generate unique session code
function generateSessionCode() {
  let code
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString()
  } while (gameState.sessions.has(code))
  return code
}

// Generate collaborator color
function generateCollaboratorColor(index) {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ]
  return colors[index % colors.length]
}

function registerSocketHandlers(io, { prefixLog = '[WS]' } = {}) {
  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Register/update a presentation definition in server memory
    socket.on('register-presentation', ({ presentation }) => {
      try {
        if (!presentation || !presentation.id) {
          socket.emit('error', { message: 'Presentación inválida' })
          return
        }
        // Guardar/actualizar en memoria
        gameState.presentations.set(presentation.id, presentation)
        socket.emit('presentation-registered', { id: presentation.id })
      } catch (err) {
        console.error('Error registrando presentación:', err)
        socket.emit('error', { message: 'No se pudo registrar la presentación' })
      }
    })

    // Track connected user
    gameState.users.set(socket.id, {
      id: socket.id,
      connectedAt: new Date(),
      sessionCode: null,
    })

    // Heartbeat handling
    socket.on('ping', ({ timestamp }) => {
      socket.emit('pong', { timestamp })
    })

    // Create new session
    socket.on('create-session', ({ presentationId, teams }) => {
      // Rate limiting
      if (!checkRateLimit(socket.id, 'actions')) {
        socket.emit('error', { message: 'Demasiadas acciones. Intenta de nuevo en un momento.' })
        return
      }
      // Validate presentation exists
      if (!gameState.presentations.has(presentationId)) {
        socket.emit('error', { message: 'Presentación no encontrada' })
        return
      }
      const sessionCode = generateSessionCode()
      const session = {
        id: sessionCode,
        presentationId,
        code: sessionCode,
        host: socket.id,
        currentSlideIndex: 0,
        participants: new Map(),
        teams: teams || [],
        responses: new Map(),
        status: 'waiting',
        // Estado de preguntas (en vivo): 'show' | 'locked' | 'reveal'
        slideState: 'show',
        // Alias para compatibilidad con especificación
        state: 'show',
        // Conteos por diapositiva: Map<slideId, number[]>
        tallies: new Map(),
        // Participantes que ya respondieron por diapositiva: Map<slideId, Set<participantId>>
        answeredBySlide: new Map(),
        // Temporizadores debounce por diapositiva para emitir resultados
        resultsEmitTimers: new Map(),
        leaderboard: [],
        settings: {
          allowLateJoin: true,
          showLeaderboard: true,
          anonymousAllowed: true,
        },
        createdAt: new Date(),
        startedAt: null,
        endedAt: null,
      }
      gameState.sessions.set(sessionCode, session)
      socket.join(`session-${sessionCode}`)
      socket.join(`host-${sessionCode}`)
      // Update user's session
      const user = gameState.users.get(socket.id)
      if (user) {
        user.sessionCode = sessionCode
        user.role = 'host'
      }
      const presentation = gameState.presentations.get(presentationId)
      // eslint-disable-next-line no-console
      console.log(`${prefixLog} create-session`, { presentationId, code: sessionCode })
      socket.emit('session-created', { 
        session: {
          ...session,
          participants: Array.from(session.participants.values()),
        }, 
        presentation,
        serverUrl: `http://${ip.address()}:${port}`
      })
      // eslint-disable-next-line no-console
      console.log(`Session created: ${sessionCode} by ${socket.id}`)
    })

    // Join session as participant
    socket.on('join-session', async ({ code, name, team }) => {
      // eslint-disable-next-line no-console
      console.log(`${prefixLog} join-session ←`, { code, name })
      // Rate limiting
      if (!checkRateLimit(socket.id, 'actions')) {
        socket.emit('error', { message: 'Demasiadas acciones. Intenta de nuevo en un momento.' })
        return
      }
      // Validate code format
      if (!validateSessionCode(code)) {
        // eslint-disable-next-line no-console
        console.warn(`${prefixLog} join-session rechazado: código inválido`, { code })
        socket.emit('error', { message: 'Código de sesión inválido' })
        return
      }
      const session = gameState.sessions.get(code)
      if (!session) {
        // eslint-disable-next-line no-console
        console.warn(`${prefixLog} join-session rechazado: sesión no encontrada`, { code })
        socket.emit('error', { message: 'Sesión no encontrada' })
        return
      }
      // Validación contra Firestore: sessionsMeta/{code}
      try {
        const { adminDb } = require('../lib/firebase/admin')
        const metaRef = adminDb.collection('sessionsMeta').doc(code)
        const metaSnap = await metaRef.get()
        if (metaSnap.exists) {
          const meta = metaSnap.data() || {}
          const now = Date.now()
          if (meta.expiresAt && new Date(meta.expiresAt).getTime() < now) {
            // eslint-disable-next-line no-console
            console.warn(`${prefixLog} join-session rechazado: código expirado`, { code })
            socket.emit('error', { message: 'Código expirado' })
            return
          }
          if (typeof meta.maxParticipants === 'number') {
            const activeCount = Array.from(session.participants.values()).filter(p => p.isActive !== false).length
            if (activeCount >= meta.maxParticipants) {
              // eslint-disable-next-line no-console
              console.warn(`${prefixLog} join-session rechazado: capacidad llena`, { code, activeCount, max: meta.maxParticipants })
              socket.emit('error', { message: 'Capacidad llena' })
              return
            }
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(`${prefixLog} join-session: sessionsMeta no existe, permitiendo DEV`, { code })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`${prefixLog} join-session validación meta falló`, e)
      }
      // Check if session is joinable
      if (session.status === 'ended') {
        // eslint-disable-next-line no-console
        console.warn(`${prefixLog} join-session rechazado: sesión terminada`, { code })
        socket.emit('error', { message: 'La sesión ha terminado' })
        return
      }
      if (!session.settings.allowLateJoin && session.status !== 'waiting') {
        // eslint-disable-next-line no-console
        console.warn(`${prefixLog} join-session rechazado: sesión ya comenzó`, { code })
        socket.emit('error', { message: 'La sesión ya comenzó' })
        return
      }
      // Validate name
      if (!name || name.trim().length === 0) {
        // eslint-disable-next-line no-console
        console.warn(`${prefixLog} join-session rechazado: nombre requerido`, { code })
        socket.emit('error', { message: 'Nombre requerido' })
        return
      }
      const participant = {
        id: socket.id,
        name: name.trim(),
        team,
        score: 0,
        responses: new Map(),
        joinedAt: new Date(),
        lastActiveAt: new Date(),
      }
      session.participants.set(socket.id, participant)
      socket.join(`session-${code}`)
      // Update user's session
      const user = gameState.users.get(socket.id)
      if (user) {
        user.sessionCode = code
        user.role = 'participant'
      }
      const presentation = gameState.presentations.get(session.presentationId)
      const currentSlide = presentation.slides[session.currentSlideIndex]
      socket.emit('joined-session', {
        session: {
          code: session.code,
          currentSlideIndex: session.currentSlideIndex,
          status: session.status,
          settings: session.settings,
        },
        presentation,
        currentSlide,
        participant
      })
      // Notify host of new participant
      io.to(`host-${code}`).emit('participant-joined', {
        participant,
        totalParticipants: session.participants.size
      })
      // Broadcast conteo de audiencia a todos en la sesión
      io.to(`session-${code}`).emit('audience:update', {
        totalParticipants: session.participants.size,
      })
      // eslint-disable-next-line no-console
      console.log(`${prefixLog} join-session OK → participante unido`, { code, name, room: `session-${code}` })
    })

    // Start session
    socket.on('start-session', ({ sessionCode }) => {
      const session = gameState.sessions.get(sessionCode)
      if (!session || socket.id !== session.host) {
        socket.emit('error', { message: 'No autorizado' })
        return
      }
      session.status = 'active'
      session.startedAt = new Date()
      io.to(`session-${sessionCode}`).emit('session-started', {
        startedAt: session.startedAt
      })
      console.log(`Session ${sessionCode} started`)
    })

    // End session
    socket.on('end-session', ({ sessionCode }) => {
      const session = gameState.sessions.get(sessionCode)
      if (!session || socket.id !== session.host) {
        socket.emit('error', { message: 'No autorizado' })
        return
      }
      session.status = 'ended'
      session.endedAt = new Date()
      // Cleanup en memoria: timers, tallies y respuestas marcadas
      try {
        if (session.resultsEmitTimers && session.resultsEmitTimers.size > 0) {
          session.resultsEmitTimers.forEach((t) => { try { clearTimeout(t) } catch {} })
          session.resultsEmitTimers.clear()
        }
        if (session.answeredBySlide) session.answeredBySlide.clear()
        if (session.tallies) session.tallies.clear()
        console.log(`[end-session] cleanup: timers=${session.resultsEmitTimers?.size || 0}, tallies=${session.tallies?.size || 0}`)
      } catch (e) {
        console.error('[end-session] cleanup error', e)
      }
      // Calculate final results
      const finalResults = {
        leaderboard: session.leaderboard,
        duration: session.endedAt - session.startedAt,
        totalParticipants: session.participants.size,
      }
      io.to(`session-${sessionCode}`).emit('session-ended', finalResults)
      // Clean up after 5 minutes
      setTimeout(() => {
        gameState.sessions.delete(sessionCode)
        console.log(`Session ${sessionCode} cleaned up`)
      }, 300000)
      console.log(`Session ${sessionCode} ended`)
    })

    // Host controls
    socket.on('next-slide', ({ sessionCode }) => {
      if (!checkRateLimit(socket.id, 'actions')) {
        socket.emit('error', { message: 'Demasiadas acciones' })
        return
      }
      const session = gameState.sessions.get(sessionCode)
      if (!session || socket.id !== session.host) return
      const presentation = gameState.presentations.get(session.presentationId)
      if (session.currentSlideIndex < presentation.slides.length - 1) {
        session.currentSlideIndex++
        const currentSlide = presentation.slides[session.currentSlideIndex]
        io.to(`session-${sessionCode}`).emit('slide-changed', {
          slideIndex: session.currentSlideIndex,
          slide: currentSlide
        })
        if (currentSlide.timeLimit) {
          setTimeout(() => {
            io.to(`session-${sessionCode}`).emit('time-up', { slideId: currentSlide.id })
          }, currentSlide.timeLimit * 1000)
        }
      }
    })

    // ===== NUEVOS HANDLERS: Estado de pregunta (show/lock/reveal/next) =====
    // Estos eventos actualizan el estado en memoria y emiten slide:state al canal session-{code}
    socket.on('question:show', ({ slideIndex }) => {
      try {
        const user = gameState.users.get(socket.id)
        const code = user?.sessionCode
        if (!code) return
        const session = gameState.sessions.get(code)
        if (!session || socket.id !== session.host) return
        const presentation = gameState.presentations.get(session.presentationId)
        if (!presentation) return
        if (typeof slideIndex !== 'number' || slideIndex < 0 || slideIndex >= presentation.slides.length) return
        session.currentSlideIndex = slideIndex
        session.slideState = 'show'
        session.state = 'show'
        const currentSlide = presentation.slides[session.currentSlideIndex]
        // Compat heredada
        io.to(`session-${code}`).emit('slide-changed', { slideIndex: session.currentSlideIndex, slide: currentSlide })
        // Nuevo evento
        // eslint-disable-next-line no-console
        console.log(`${prefixLog} question:show`, { code, slideIndex: session.currentSlideIndex })
        io.to(`session-${code}`).emit('slide:state', { slideIndex: session.currentSlideIndex, state: 'show' })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WebSocket] question:show error', error)
      }
    })

    socket.on('question:lock', ({ slideIndex }) => {
      try {
        const user = gameState.users.get(socket.id)
        const code = user?.sessionCode
        if (!code) return
        const session = gameState.sessions.get(code)
        if (!session || socket.id !== session.host) return
        // Si se provee slideIndex, sincronizamos
        if (typeof slideIndex === 'number') {
          session.currentSlideIndex = slideIndex
        }
        session.slideState = 'locked'
        session.state = 'locked'
        // eslint-disable-next-line no-console
        console.log(`${prefixLog} question:lock`, { code, slideIndex: session.currentSlideIndex })
        io.to(`session-${code}`).emit('slide:state', { slideIndex: session.currentSlideIndex, state: 'locked' })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WebSocket] question:lock error', error)
      }
    })

    socket.on('question:reveal', ({ slideIndex }) => {
      try {
        const user = gameState.users.get(socket.id)
        const code = user?.sessionCode
        if (!code) return
        const session = gameState.sessions.get(code)
        if (!session || socket.id !== session.host) return
        if (typeof slideIndex === 'number') {
          session.currentSlideIndex = slideIndex
        }
        session.slideState = 'reveal'
        session.state = 'reveal'
        // eslint-disable-next-line no-console
        console.log(`${prefixLog} question:reveal`, { code, slideIndex: session.currentSlideIndex })
        io.to(`session-${code}`).emit('slide:state', { slideIndex: session.currentSlideIndex, state: 'reveal' })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WebSocket] question:reveal error', error)
      }
    })

    socket.on('question:next', ({ nextIndex }) => {
      try {
        const user = gameState.users.get(socket.id)
        const code = user?.sessionCode
        if (!code) return
        const session = gameState.sessions.get(code)
        if (!session || socket.id !== session.host) return
        const presentation = gameState.presentations.get(session.presentationId)
        if (!presentation) return
        if (typeof nextIndex !== 'number' || nextIndex < 0 || nextIndex >= presentation.slides.length) return
        session.currentSlideIndex = nextIndex
        session.slideState = 'show'
        session.state = 'show'
        const currentSlide = presentation.slides[session.currentSlideIndex]
        // Compat heredada
        io.to(`session-${code}`).emit('slide-changed', { slideIndex: session.currentSlideIndex, slide: currentSlide })
        // Nuevo evento
        // eslint-disable-next-line no-console
        console.log(`${prefixLog} question:next`, { code, nextIndex: session.currentSlideIndex })
        io.to(`session-${code}`).emit('slide:state', { slideIndex: session.currentSlideIndex, state: 'show' })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WebSocket] question:next error', error)
      }
    })

    // Submit answer (legacy)
    socket.on('submit-answer', ({ sessionCode, slideId, answer, timeSpent }) => {
      if (!checkRateLimit(socket.id, 'messages')) {
        socket.emit('error', { message: 'Demasiadas respuestas' })
        return
      }
      const session = gameState.sessions.get(sessionCode)
      if (!session) return
      const participant = session.participants.get(socket.id)
      if (!participant) return
      // Update last active
      participant.lastActiveAt = new Date()
      const presentation = gameState.presentations.get(session.presentationId)
      const slide = presentation.slides.find(s => s.id === slideId)
      // Calculate points for trivia
      let pointsEarned = 0
      let isCorrect = false
      if (slide.type === 'trivia') {
        isCorrect = answer === slide.correctAnswer
        if (isCorrect) {
          // Bonus points for speed
          const speedBonus = Math.max(0, Math.floor((slide.timeLimit - timeSpent) / slide.timeLimit * 50))
          pointsEarned = slide.points + speedBonus
          participant.score += pointsEarned
        }
      }
      // Store response
      if (!session.responses.has(slideId)) session.responses.set(slideId, [])
      session.responses.get(slideId).push({
        participantId: socket.id,
        answer,
        isCorrect,
        pointsEarned,
        timeSpent,
        timestamp: new Date()
      })
      participant.responses.set(slideId, { answer, isCorrect, pointsEarned })
      // Update leaderboard
      updateLeaderboard(session)
      // Send results to host
      io.to(`host-${sessionCode}`).emit('answer-received', {
        slideId,
        participantId: socket.id,
        participantName: participant.name,
        answer,
        isCorrect,
        responses: session.responses.get(slideId),
        leaderboard: session.leaderboard
      })
      // Confirm to participant
      socket.emit('answer-confirmed', { isCorrect, pointsEarned })
    })

    // Nuevo handler: answer:submit (multiple-choice con índice 0..n-1)
    socket.on('answer:submit', ({ slideId, slideIndex, participantId, answer }) => {
      try {
        if (!checkRateLimit(socket.id, 'messages')) {
          socket.emit('error', { message: 'Demasiadas respuestas' })
          return
        }
        const user = gameState.users.get(socket.id)
        const code = user?.sessionCode
        if (!code) return
        const session = gameState.sessions.get(code)
        if (!session) return
        // Si la pregunta está bloqueada, rechazar
        if (session.slideState === 'locked') {
          socket.emit('error', { message: 'Respuestas bloqueadas' })
          return
        }
        const presentation = gameState.presentations.get(session.presentationId)
        if (!presentation) return
        const effectiveIndex = typeof slideIndex === 'number' ? slideIndex : session.currentSlideIndex
        const slide = presentation.slides[effectiveIndex]
        if (!slide || slide.id !== slideId) {
          // fallback: buscar por id
          const byId = presentation.slides.find(s => s.id === slideId)
          if (!byId) return
        }
        const resolvedSlide = presentation.slides[effectiveIndex] && presentation.slides[effectiveIndex].id === slideId
          ? presentation.slides[effectiveIndex]
          : presentation.slides.find(s => s.id === slideId)
        if (!resolvedSlide || !Array.isArray(resolvedSlide.options)) return
        // Solo aceptar multiple choice/trivia
        const slideType = resolvedSlide.type
        const isMultipleChoice = slideType === 'multiple_choice' || slideType === 'trivia'
        if (!isMultipleChoice) return
        // Validar rango
        if (typeof answer !== 'number' || answer < 0 || answer >= resolvedSlide.options.length) {
          socket.emit('error', { message: 'Respuesta inválida' })
          return
        }
        // Evitar respuestas duplicadas por participante
        if (!session.answeredBySlide.has(slideId)) {
          session.answeredBySlide.set(slideId, new Set())
        }
        const answeredSet = session.answeredBySlide.get(slideId)
        if (answeredSet.has(socket.id)) return // ignorar segundo intento
        answeredSet.add(socket.id)
        // Inicializar tallies
        if (!session.tallies.has(slideId)) {
          session.tallies.set(slideId, new Array(resolvedSlide.options.length).fill(0))
        }
        const counts = session.tallies.get(slideId)
        counts[answer] = (counts[answer] || 0) + 1
        // Emitir actualización inmediata
        const total = counts.reduce((a, b) => a + b, 0)
        // eslint-disable-next-line no-console
        console.log(`${prefixLog} answer:submit`, { code, slideId, slideIndex: effectiveIndex })
        io.to(`host-${code}`).emit('results:update', { slideId, counts: [...counts], total })
        io.to(`session-${code}`).emit('results:update', { slideId, counts: [...counts], total })
        // Debounce 150ms si estamos en reveal
        if (session.slideState === 'reveal') {
          const existingTimer = session.resultsEmitTimers.get(slideId)
          if (existingTimer) clearTimeout(existingTimer)
          const t = setTimeout(() => {
            const latest = session.tallies.get(slideId) || new Array(resolvedSlide.options.length).fill(0)
            const currentTotal = latest.reduce((a, b) => a + b, 0)
            io.to(`host-${code}`).emit('results:update', { slideId, counts: [...latest], total: currentTotal })
            io.to(`session-${code}`).emit('results:update', { slideId, counts: [...latest], total: currentTotal })
            session.resultsEmitTimers.delete(slideId)
          }, 150)
          session.resultsEmitTimers.set(slideId, t)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WebSocket] answer:submit error', error)
      }
    })

    // Compat: mapear 'submit-answer' al nuevo 'answer:submit'
    socket.on('submit-answer', (payload) => {
      try {
        socket.emit('debug', { note: 'submit-answer deprecated → forwarding to answer:submit' })
        socket.listeners('answer:submit')?.forEach(fn => fn(payload))
      } catch (e) {
        console.error('[WebSocket] compat submit-answer → answer:submit', e)
      }
    })

    // Submit word cloud entry
    socket.on('submit-word-cloud', ({ sessionCode, slideId, words }) => {
      if (!checkRateLimit(socket.id, 'messages')) {
        socket.emit('error', { message: 'Demasiadas respuestas' })
        return
      }
      const session = gameState.sessions.get(sessionCode)
      if (!session) return
      if (!session.responses.has(slideId)) {
        session.responses.set(slideId, [])
      }
      session.responses.get(slideId).push({
        participantId: socket.id,
        words,
        timestamp: new Date()
      })
      // Aggregate word cloud data
      const wordCounts = new Map()
      session.responses.get(slideId).forEach(response => {
        response.words.forEach(word => {
          const normalized = word.toLowerCase().trim()
          wordCounts.set(normalized, (wordCounts.get(normalized) || 0) + 1)
        })
      })
      // Send to all participants
      io.to(`session-${sessionCode}`).emit('word-cloud-update', {
        slideId,
        wordCounts: Array.from(wordCounts.entries()).map(([word, count]) => ({ word, count }))
      })
    })

    // Send reaction
    socket.on('send-reaction', ({ sessionCode, emoji }) => {
      if (!checkRateLimit(socket.id, 'messages')) {
        return // Silent fail for reactions
      }
      const session = gameState.sessions.get(sessionCode)
      if (!session) return
      const participant = session.participants.get(socket.id)
      if (!participant) return
      io.to(`host-${sessionCode}`).emit('reaction-received', {
        emoji,
        participantId: socket.id,
        participantName: participant.name,
        timestamp: new Date()
      })
      // Broadcast to other participants (optional)
      socket.to(`session-${sessionCode}`).emit('reaction-display', {
        emoji,
        participantName: participant.name
      })
    })

    // Team-based features
    socket.on('update-team-score', ({ sessionCode, team, points }) => {
      const session = gameState.sessions.get(sessionCode)
      if (!session || socket.id !== session.host) return
      if (!session.teamScores) {
        session.teamScores = new Map()
      }
      const currentScore = session.teamScores.get(team) || 0
      session.teamScores.set(team, currentScore + points)
      io.to(`session-${sessionCode}`).emit('team-scores-updated', {
        teamScores: Array.from(session.teamScores.entries())
      })
    })

    // Get session status
    socket.on('get-session-status', ({ sessionCode }) => {
      const session = gameState.sessions.get(sessionCode)
      if (!session) {
        socket.emit('session-status', { exists: false })
        return
      }
      socket.emit('session-status', {
        exists: true,
        status: session.status,
        participantCount: session.participants.size,
        currentSlideIndex: session.currentSlideIndex,
      })
    })

    // ===== COLLABORATIVE EDITING HANDLERS =====

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      const user = gameState.users.get(socket.id)
      if (user && user.sessionCode) {
        const session = gameState.sessions.get(user.sessionCode)
        if (session) {
          if (user.role === 'participant' && session.participants.has(socket.id)) {
            const participant = session.participants.get(socket.id)
            // Mark as inactive instead of removing
            participant.isActive = false
            participant.disconnectedAt = new Date()
            io.to(`host-${user.sessionCode}`).emit('participant-left', {
              participantId: socket.id,
              participantName: participant.name,
              totalParticipants: session.participants.size,
              activeParticipants: Array.from(session.participants.values()).filter(p => p.isActive !== false).length
            })
            // Actualizar audiencia
            io.to(`session-${user.sessionCode}`).emit('audience:update', {
              totalParticipants: session.participants.size,
            })
          } else if (user.role === 'host' && session.host === socket.id) {
            // Host disconnected - pause session
            session.status = 'paused'
            io.to(`session-${user.sessionCode}`).emit('host-disconnected', {
              message: 'El presentador se ha desconectado. La sesión está pausada.'
            })
          }
        }
      }
      // Clean up collaboration sessions
      gameState.collaborations.forEach((collaborators, presentationId) => {
        collaborators.forEach((collaborator, userId) => {
          if (collaborator.socketId === socket.id) {
            collaborators.delete(userId)
            // Notify other collaborators
            socket.to(`collab-${presentationId}`).emit('collaborator-left', {
              userId,
              userName: collaborator.userName,
            })
            // Clean up empty collaboration sessions
            if (collaborators.size === 0) {
              gameState.collaborations.delete(presentationId)
            }
          }
        })
      })
      // Clean up
      gameState.users.delete(socket.id)
      gameState.rateLimits.delete(socket.id)
    })

    // Join collaboration session
    socket.on('join-collaboration', ({ presentationId, userId, userName, userEmail }) => {
      const collaborationRoom = `collab-${presentationId}`
      // Join the collaboration room
      socket.join(collaborationRoom)
      // Track collaborator
      if (!gameState.collaborations.has(presentationId)) {
        gameState.collaborations.set(presentationId, new Map())
      }
      const collaborators = gameState.collaborations.get(presentationId)
      const color = generateCollaboratorColor(collaborators.size)
      collaborators.set(userId, {
        socketId: socket.id,
        userId,
        userName,
        userEmail,
        color,
        lastActiveAt: new Date(),
        isActive: true,
        role: collaborators.size === 0 ? 'owner' : 'editor',
      })
      // Send current collaborators list to the new user
      socket.emit('collaborators-list', {
        collaborators: Array.from(collaborators.values()).map(c => ({
          userId: c.userId,
          userName: c.userName,
          userEmail: c.userEmail,
          color: c.color,
          lastActiveAt: c.lastActiveAt,
          isActive: c.isActive,
          role: c.role,
        }))
      })
      // Notify others of new collaborator
      socket.to(collaborationRoom).emit('collaborator-joined', { userId, userName, userEmail, color })
      console.log(`${userName} joined collaboration for presentation ${presentationId}`)
    })

    // Leave collaboration session
    socket.on('leave-collaboration', ({ presentationId, userId }) => {
      const collaborationRoom = `collab-${presentationId}`
      socket.leave(collaborationRoom)
      const collaborators = gameState.collaborations.get(presentationId)
      if (collaborators) {
        const collaborator = collaborators.get(userId)
        if (collaborator) {
          collaborators.delete(userId)
          // Notify others
          socket.to(collaborationRoom).emit('collaborator-left', {
            userId,
            userName: collaborator.userName,
          })
          // Clean up empty collaboration sessions
          if (collaborators.size === 0) {
            gameState.collaborations.delete(presentationId)
          }
        }
      }
    })

    // Handle cursor movement
    socket.on('cursor-move', ({ userId, presentationId, cursor }) => {
      if (!checkRateLimit(socket.id, 'messages')) return
      const collaborationRoom = `collab-${presentationId}`
      // Update collaborator's last activity
      const collaborators = gameState.collaborations.get(presentationId)
      if (collaborators) {
        const collaborator = collaborators.get(userId)
        if (collaborator) {
          collaborator.lastActiveAt = new Date()
        }
      }
      // Broadcast cursor position to other collaborators
      socket.to(collaborationRoom).emit('cursor-update', { userId, cursor })
    })

    // Handle content changes
    socket.on('content-change', ({ userId, presentationId, change }) => {
      if (!checkRateLimit(socket.id, 'actions')) {
        socket.emit('error', { message: 'Demasiadas acciones. Intenta de nuevo.' })
        return
      }
      const collaborationRoom = `collab-${presentationId}`
      // Validate change structure
      if (!change.type || !change.target || !change.targetId) {
        socket.emit('error', { message: 'Cambio inválido' })
        return
      }
      // Broadcast change to other collaborators
      socket.to(collaborationRoom).emit('content-change', {
        userId,
        change: { ...change, timestamp: new Date().toISOString() },
      })
      console.log(`Content change from ${userId} in presentation ${presentationId}`)
    })

    // Heartbeat for collaboration
    socket.on('heartbeat', ({ userId }) => {
      // Update last activity for all collaboration sessions
      gameState.collaborations.forEach((collaborators, presentationId) => {
        const collaborator = collaborators.get(userId)
        if (collaborator && collaborator.socketId === socket.id) {
          collaborator.lastActiveAt = new Date()
          collaborator.isActive = true
        }
      })
    })

    // Request sync
    socket.on('sync-request', ({ presentationId }) => {
      const collaborationRoom = `collab-${presentationId}`
      // Ask a random active collaborator for current state
      const collaborators = gameState.collaborations.get(presentationId)
      if (collaborators && collaborators.size > 1) {
        const activeCollaborators = Array.from(collaborators.values())
          .filter(c => c.socketId !== socket.id && c.isActive)
        if (activeCollaborators.length > 0) {
          const randomCollaborator = activeCollaborators[Math.floor(Math.random() * activeCollaborators.length)]
          io.to(randomCollaborator.socketId).emit('sync-request')
        }
      }
    })

    function updateLeaderboard(session) {
      const leaderboard = Array.from(session.participants.values())
        .filter(p => p.isActive !== false)
        .map(p => ({ id: p.id, name: p.name, team: p.team, score: p.score, responseCount: p.responses.size }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
      session.leaderboard = leaderboard
    }
  })
}

module.exports = { registerSocketHandlers }

if (require.main === module) app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Add error handling for Next.js routes
    handle(req, res).catch((err) => {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    })
  })

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 30000,
  })

  initializeDemoPresentations()

  registerSocketHandlers(io, { prefixLog: '[WS]' })

  function updateLeaderboard(session) {
    const leaderboard = Array.from(session.participants.values())
      .filter(p => p.isActive !== false)
      .map(p => ({ id: p.id, name: p.name, team: p.team, score: p.score, responseCount: p.responses.size }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    session.leaderboard = leaderboard
  }

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> Local network: http://${ip.address()}:${port}`)
    console.log(`> WebSocket server running`)
  })

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down gracefully...')
    
    // Close all socket connections
    io.sockets.sockets.forEach((socket) => {
      socket.disconnect(true)
    })
    
    // Close the server
    server.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Could not close connections in time, forcefully shutting down')
      process.exit(1)
    }, 10000)
  }

  // Handle termination signals
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    gracefulShutdown()
  })
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    // Don't exit on unhandled rejections, just log them
  })
}).catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})