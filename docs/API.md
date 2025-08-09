# API Documentation - AutoSpark Games

## WebSocket API Mejorado

El servidor WebSocket corre en `http://localhost:3004` y maneja toda la comunicación en tiempo real con reconexión automática, heartbeat, y rate limiting.

### Características Nuevas
- **Reconexión Automática**: Hasta 5 intentos con backoff exponencial
- **Sistema de Heartbeat**: Ping/pong cada 30 segundos para mantener conexión
- **Rate Limiting**: 100 mensajes/min, 30 acciones/min
- **Métricas en Tiempo Real**: Latencia, mensajes enviados/recibidos
- **Validación Mejorada**: Validación de datos en todos los eventos
- **Manejo de Desconexión**: Soporte para reconexión de participantes

### Eventos del Cliente → Servidor

#### `ping`
Heartbeat para mantener conexión y medir latencia.

```javascript
socket.emit('ping', {
  timestamp: number
})

// Respuesta
socket.on('pong', {
  timestamp: number
})
```

#### `create-session`
Crea una nueva sesión de juego/presentación.

```javascript
socket.emit('create-session', {
  presentationId: string,
  teams?: Team[]
})

// Respuesta
socket.on('session-created', {
  session: {
    id: string,
    code: string,
    presentationId: string,
    currentSlideIndex: number,
    status: 'waiting' | 'active' | 'ended'
  },
  presentation: Presentation,
  serverUrl: string
})
```

#### `join-session`
Unirse a una sesión existente como participante.

```javascript
socket.emit('join-session', {
  code: string,
  name: string,
  team?: string
})

// Respuesta
socket.on('joined-session', {
  session: SessionInfo,
  presentation: Presentation,
  currentSlide: Slide,
  participant: Participant
})
```

#### `submit-answer`
Enviar respuesta a una pregunta.

```javascript
socket.emit('submit-answer', {
  sessionCode: string,
  slideId: string,
  answer: string | number,
  timeSpent: number
})

// Respuesta
socket.on('answer-confirmed', {
  isCorrect: boolean,
  pointsEarned: number
})
```

#### `send-reaction`
Enviar una reacción emoji.

```javascript
socket.emit('send-reaction', {
  sessionCode: string,
  emoji: string
})
```

#### `submit-word-cloud`
Enviar palabras para nube de palabras.

```javascript
socket.emit('submit-word-cloud', {
  sessionCode: string,
  slideId: string,
  words: string[]
})
```

#### `reconnect-session`
Reconectar a una sesión después de desconexión.

```javascript
socket.emit('reconnect-session', {
  sessionCode: string,
  participantId: string
})

// Respuesta
socket.on('reconnected', {
  session: SessionInfo,
  currentSlide: Slide,
  participant: Participant
})
```

#### `get-session-status`
Verificar si existe una sesión.

```javascript
socket.emit('get-session-status', {
  sessionCode: string
})

// Respuesta
socket.on('session-status', {
  exists: boolean,
  status?: string,
  participantCount?: number,
  currentSlideIndex?: number
})
```

#### `update-team-score`
Actualizar puntuación de equipo (solo host).

```javascript
socket.emit('update-team-score', {
  sessionCode: string,
  team: string,
  points: number
})
```

### Eventos del Servidor → Cliente

#### `pong`
Respuesta al ping para medir latencia.

```javascript
socket.on('pong', {
  timestamp: number
})
```

#### `participant-joined`
Notifica cuando un participante se une (solo al host).

```javascript
socket.on('participant-joined', {
  participant: Participant,
  totalParticipants: number
})
```

#### `slide-changed`
Notifica cambio de slide a todos los participantes.

```javascript
socket.on('slide-changed', {
  slideIndex: number,
  slide: Slide
})
```

#### `answer-received`
Actualización en tiempo real de respuestas (solo al host).

```javascript
socket.on('answer-received', {
  slideId: string,
  responses: Response[],
  leaderboard: LeaderboardEntry[]
})
```

#### `reaction-received`
Reacción recibida de un participante (solo al host).

```javascript
socket.on('reaction-received', {
  emoji: string,
  participantId: string,
  participantName: string,
  timestamp: Date
})
```

#### `reaction-display`
Mostrar reacción a otros participantes.

```javascript
socket.on('reaction-display', {
  emoji: string,
  participantName: string
})
```

#### `word-cloud-update`
Actualización de nube de palabras.

```javascript
socket.on('word-cloud-update', {
  slideId: string,
  wordCounts: Array<{
    word: string,
    count: number
  }>
})
```

#### `team-scores-updated`
Actualización de puntuaciones de equipos.

```javascript
socket.on('team-scores-updated', {
  teamScores: Array<[string, number]>
})
```

#### `participant-left`
Participante se desconectó.

```javascript
socket.on('participant-left', {
  participantId: string,
  participantName: string,
  totalParticipants: number,
  activeParticipants: number
})
```

#### `participant-reconnected`
Participante se reconectó.

```javascript
socket.on('participant-reconnected', {
  participantId: string,
  participantName: string
})
```

#### `host-disconnected`
El host se desconectó.

```javascript
socket.on('host-disconnected', {
  message: string
})
```

#### `session-started`
La sesión ha comenzado.

```javascript
socket.on('session-started', {
  startedAt: Date
})
```

#### `session-ended`
La sesión ha terminado.

```javascript
socket.on('session-ended', {
  leaderboard: LeaderboardEntry[],
  duration: number,
  totalParticipants: number
})
```

#### `time-up`
Tiempo agotado para slide actual.

```javascript
socket.on('time-up', {
  slideId: string
})
```

#### `error`
Error en cualquier operación.

```javascript
socket.on('error', {
  message: string
})
```

## REST API (Próximamente)

### Autenticación
```http
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/me
```

### Presentaciones
```http
GET    /api/presentations
POST   /api/presentations
GET    /api/presentations/:id
PUT    /api/presentations/:id
DELETE /api/presentations/:id
```

### Sesiones
```http
POST   /api/sessions
GET    /api/sessions/:id
PUT    /api/sessions/:id/end
GET    /api/sessions/:id/results
```

### Analytics
```http
GET    /api/analytics/overview
GET    /api/analytics/sessions/:id
GET    /api/analytics/presentations/:id
```

## Tipos de Datos

### Presentation
```typescript
interface Presentation {
  id: string
  title: string
  description?: string
  type: 'quiz' | 'game' | 'mixed'
  status: 'draft' | 'ready' | 'active' | 'archived'
  contents: ContentItem[]
  settings?: PresentationSettings
  createdAt: string
  lastModified: string
}
```

### Session
```typescript
interface Session {
  id: string
  code: string
  presentationId: string
  status: 'scheduled' | 'active' | 'paused' | 'ended'
  participants: Participant[]
  currentSlideIndex: number
  responses: SessionResponse[]
  startedAt?: string
  endedAt?: string
}
```

### Participant
```typescript
interface Participant {
  id: string
  name?: string
  email?: string
  team?: string
  score: number
  joinedAt: string
  lastActiveAt: string
  isActive: boolean
}
```

### ContentItem
```typescript
interface ContentItem {
  id: string
  type: 'slide' | 'game'
  subtype: SlideType | GameType
  title: string
  description?: string
  order: number
  data?: any
}
```

## Códigos de Error

### WebSocket Errors
- `SESSION_NOT_FOUND`: Código de sesión inválido
- `SESSION_FULL`: Sesión llena
- `INVALID_ANSWER`: Respuesta inválida
- `UNAUTHORIZED`: No autorizado para esta acción

### HTTP Status Codes (REST API)
- `200 OK`: Éxito
- `201 Created`: Recurso creado
- `400 Bad Request`: Solicitud inválida
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Rate Limiting

### WebSocket
- **Mensajes**: 100 por minuto por conexión
- **Acciones**: 30 por minuto por conexión
- **Sesiones activas**: 10 por usuario
- **Reconexiones**: 5 intentos con backoff exponencial

### REST API
- 1000 requests por hora para usuarios autenticados
- 100 requests por hora para usuarios anónimos

## Hook useSocket

### Uso Básico
```javascript
import { useSocket } from '@/lib/hooks/useSocket'

function MyComponent() {
  const { 
    socket, 
    status, 
    metrics, 
    connect, 
    disconnect, 
    emit, 
    on 
  } = useSocket({
    autoConnect: true,
    onConnect: () => console.log('Conectado'),
    onDisconnect: (reason) => console.log('Desconectado:', reason)
  })

  // Ver métricas
  console.log('Latencia:', metrics.latency, 'ms')
  console.log('Mensajes enviados:', metrics.messagesSent)
  
  // Enviar evento
  emit('join-session', { code: '123456', name: 'Juan' })
  
  // Escuchar evento
  useEffect(() => {
    const cleanup = on('slide-changed', (data) => {
      console.log('Nuevo slide:', data)
    })
    return cleanup
  }, [on])
}
```

### Hook useGameSession
```javascript
import { useGameSession } from '@/lib/hooks/useSocket'

function GameComponent() {
  const {
    isConnected,
    sessionData,
    isHost,
    joinSession,
    createSession,
    submitAnswer,
    sendReaction,
    nextSlide,
    previousSlide
  } = useGameSession(sessionCode)

  // Crear sesión (host)
  await createSession('presentation-id', ['Team A', 'Team B'])
  
  // Unirse a sesión (participante)
  await joinSession('123456', 'Juan', 'Team A')
  
  // Enviar respuesta
  await submitAnswer('slide-1', 'answer-2', 5.3)
  
  // Enviar reacción
  sendReaction('🎉')
}
```

## Ejemplos de Uso

### Crear y Lanzar Sesión
```javascript
// 1. Conectar al WebSocket
const socket = io('http://localhost:3004')

// 2. Crear sesión
socket.emit('create-session', {
  presentationId: 'pres-123',
  teams: ['Equipo A', 'Equipo B']
})

// 3. Escuchar confirmación
socket.on('session-created', (data) => {
  console.log('Código de sesión:', data.session.code)
})

// 4. Navegar slides
socket.emit('next-slide', { sessionCode })
```

### Unirse como Participante
```javascript
// 1. Conectar
const socket = io('http://localhost:3004')

// 2. Unirse con código
socket.emit('join-session', {
  code: '123456',
  name: 'Juan Pérez',
  team: 'Equipo A'
})

// 3. Escuchar slides
socket.on('slide-changed', (data) => {
  renderSlide(data.slide)
})

// 4. Enviar respuesta
socket.emit('submit-answer', {
  sessionCode: '123456',
  slideId: 'slide-2',
  answer: '2',
  timeSpent: 5.3
})
```