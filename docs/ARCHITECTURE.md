# Arquitectura del Proyecto - AutoSpark Games

## 📁 Estructura de Archivos Clave

### 🎯 Core del Sistema

```
autosparkgames/
├── 📱 app/                          # Next.js App Router
│   ├── presenter/                   # Dashboard del presentador
│   │   ├── page.tsx                # Dashboard principal
│   │   ├── new/page.tsx            # Crear presentación
│   │   ├── edit/[id]/page.tsx      # Editor de presentación
│   │   ├── session/[id]/page.tsx   # Control de sesión en vivo
│   │   ├── templates/page.tsx      # Galería de plantillas
│   │   └── layout.tsx              # Layout con sidebar
│   │
│   ├── participant/                 # Interfaz del participante
│   │   ├── page.tsx                # Dashboard participante
│   │   └── stats/page.tsx          # Estadísticas personales
│   │
│   ├── session/[code]/             # Sesión activa
│   │   └── page.tsx                # Vista de juego/quiz
│   │
│   └── join/page.tsx               # Unirse a sesión
│
├── 🧩 components/                   # Componentes reutilizables
│   ├── presenter/                   # Componentes del presentador
│   │   ├── Sidebar.tsx             # Navegación lateral
│   │   ├── CommandPalette.tsx      # Cmd+K palette
│   │   ├── LivePreview.tsx         # Vista previa en vivo
│   │   ├── ContentEditor.tsx       # Editor de contenido
│   │   ├── PresentationCard.tsx    # Tarjeta de presentación
│   │   └── Onboarding.tsx          # Tour para nuevos usuarios
│   │
│   ├── game/                        # Componentes de juegos
│   │   ├── Trivia.tsx              # Juego de trivia
│   │   ├── WordCloud.tsx           # Nube de palabras
│   │   ├── Poll.tsx                # Encuestas
│   │   └── Leaderboard.tsx         # Tabla de puntuaciones
│   │
│   └── ui/                          # Componentes UI base
│
├── 🎨 lib/                          # Librerías y utilidades
│   ├── design-system/               # Sistema de diseño
│   │   ├── tokens/                 # Design tokens
│   │   ├── components/             # Componentes base
│   │   └── hooks/                  # Hooks personalizados
│   │
│   ├── store/                       # Estado global (Zustand)
│   │   ├── presenter.ts            # Estado del presentador
│   │   ├── participant.ts          # Estado del participante
│   │   └── ui.ts                   # Estado de UI
│   │
│   ├── firebase/                    # Configuración Firebase
│   │   ├── config.ts               # Configuración
│   │   ├── auth.ts                 # Autenticación
│   │   └── firestore.ts            # Base de datos
│   │
│   └── hooks/                       # Hooks compartidos
│       ├── useAutoSave.ts          # Auto-guardado
│       ├── useSocket.ts            # WebSocket connection
│       └── useGameSession.ts       # Lógica de sesión
│
├── 🚀 server/                       # Backend
│   └── websocket.js                # Servidor WebSocket
│
└── 📄 docs/                         # Documentación
    ├── ARCHITECTURE.md             # Este archivo
    ├── API.md                      # Documentación API
    └── FEATURES.md                 # Roadmap de features
```

## 🔄 Flujos de Datos

### 1. Flujo del Presentador
```
Presenter Dashboard → Create/Edit → Preview → Launch Session → Control Live
     ↓                    ↓            ↓          ↓              ↓
  Zustand Store      Auto-save    Live Preview  WebSocket    Real-time Updates
```

### 2. Flujo del Participante
```
Join Page → Enter Code → Wait for Host → Play Game → View Results
    ↓           ↓             ↓             ↓            ↓
 Validation  WebSocket    Session State  Submit Answer  Leaderboard
```

### 3. Flujo de Datos en Tiempo Real
```
WebSocket Server (Socket.io)
    ├── Session Management
    ├── Participant Tracking
    ├── Answer Collection
    └── Real-time Broadcasting
```

## 🏗️ Componentes Principales

### Sistema de Presentaciones
- **PresentationManager**: CRUD de presentaciones
- **ContentBuilder**: Constructor drag & drop
- **TemplateSystem**: Sistema de plantillas

### Sistema de Sesiones
- **SessionController**: Control de sesión en vivo
- **ParticipantManager**: Gestión de participantes
- **ResponseCollector**: Recolección de respuestas

### Sistema de Juegos
- **GameEngine**: Motor de juegos
- **ScoringSystem**: Sistema de puntuación
- **LeaderboardManager**: Gestión de rankings

## 🔐 Seguridad y Permisos

### Roles de Usuario
1. **Admin**: Acceso total al sistema
2. **Presenter**: Crear y gestionar contenido
3. **Participant**: Unirse y participar

### Rutas Protegidas
- `/admin/*` - Solo administradores
- `/presenter/*` - Presentadores autenticados
- `/session/*/control` - Solo host de sesión

## 📊 Estado Global (Zustand)

### presenter.ts
```typescript
- presentations: Presentation[]
- activeSessions: Session[]
- currentSession: Session | null
- createPresentation()
- updatePresentation()
- startSession()
- endSession()
```

### participant.ts
```typescript
- currentSession: SessionInfo
- playerInfo: PlayerInfo
- responses: Response[]
- joinSession()
- submitAnswer()
- sendReaction()
```

### ui.ts
```typescript
- theme: Theme
- sidebarOpen: boolean
- commandPaletteOpen: boolean
- viewMode: 'grid' | 'list'
- notifications: Notification[]
```

## 🚀 Próximos Pasos

### Fase 3: Real-time Features
1. **Colaboración en tiempo real**
2. **Chat moderado**
3. **Analytics en vivo**
4. **Notificaciones push**

### Fase 4: Advanced Features
1. **AI Content Generation**
2. **Integraciones externas**
3. **Modo offline**
4. **Exportación avanzada**

### Fase 5: Enterprise
1. **Multi-tenancy**
2. **SSO/SAML**
3. **API pública**
4. **White labeling**