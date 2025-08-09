# Guía de Desarrollo - AutoSpark Games

## 🚀 Setup Inicial

### 1. Clonar y Configurar
```bash
# Clonar repositorio
git clone <repository-url>
cd autosparkgames

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Firebase
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication, Firestore, y Storage
3. Copiar credenciales a `.env.local`

### 3. Iniciar Desarrollo
```bash
# Iniciar servidor de desarrollo (Next.js + WebSocket)
npm run dev

# La aplicación estará disponible en:
# - http://localhost:3004 (local)
# - http://[tu-ip]:3004 (red local)
```

## 📁 Estructura de Trabajo

### Flujo de Desarrollo Típico

1. **Nueva Feature del Presentador**
   ```
   app/presenter/[feature]/page.tsx  → Página principal
   components/presenter/[Feature].tsx → Componentes específicos
   lib/store/presenter.ts            → Estado si es necesario
   ```

2. **Nuevo Tipo de Juego**
   ```
   components/game/[GameName].tsx    → Componente del juego
   server/websocket.js               → Lógica del servidor
   lib/types/games.ts                → Tipos TypeScript
   ```

3. **Componente de UI Reutilizable**
   ```
   lib/design-system/components/[Component].tsx → Componente
   lib/design-system/components/index.ts        → Exportar
   ```

## 🎨 Sistema de Diseño

### Usando Design Tokens
```typescript
import { colors, spacing, typography } from '@/lib/design-system/tokens'

// Ejemplo de uso
const styles = {
  color: colors.primary[500],
  padding: spacing[4],
  fontSize: typography.sizes.lg.fontSize
}
```

### Creando Componentes Accesibles
```typescript
import { Button, TooltipWrapper } from '@/lib/design-system/components'

<TooltipWrapper content="Información útil">
  <Button variant="primary" leftIcon={<Icon />}>
    Acción
  </Button>
</TooltipWrapper>
```

## 🔄 Estado Global con Zustand

### Accediendo al Store
```typescript
import { usePresenterStore } from '@/lib/store'

function MyComponent() {
  const { presentations, createPresentation } = usePresenterStore()
  
  const handleCreate = () => {
    createPresentation({
      title: 'Nueva Presentación',
      type: 'quiz'
    })
  }
}
```

### Creando un Nuevo Store
```typescript
// lib/store/myStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface MyStore {
  // Estado
  items: Item[]
  
  // Acciones
  addItem: (item: Item) => void
}

export const useMyStore = create<MyStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((state) => ({
          items: [...state.items, item]
        }))
      }),
      { name: 'my-store' }
    )
  )
)
```

## 🔌 WebSocket Integration

### Cliente (React)
```typescript
import { useSocket } from '@/lib/hooks/useSocket'

function GameComponent() {
  const { socket, connected } = useSocket()
  
  useEffect(() => {
    if (!socket) return
    
    socket.on('game-update', (data) => {
      // Manejar actualización
    })
    
    return () => {
      socket.off('game-update')
    }
  }, [socket])
  
  const sendAction = () => {
    socket?.emit('player-action', { action: 'answer', value: 42 })
  }
}
```

### Servidor (websocket.js)
```javascript
socket.on('player-action', ({ action, value }) => {
  // Procesar acción
  const result = processAction(action, value)
  
  // Broadcast a todos en la sesión
  io.to(`session-${sessionCode}`).emit('game-update', result)
})
```

## 🧪 Testing (Próximamente)

### Unit Tests
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/lib/design-system/components'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### E2E Tests
```typescript
// e2e/presenter-flow.spec.ts
import { test, expect } from '@playwright/test'

test('create and launch presentation', async ({ page }) => {
  await page.goto('/presenter')
  await page.click('text=Nueva Presentación')
  // ... más pasos
})
```

## 🐛 Debugging Tips

### 1. WebSocket Issues
```javascript
// Habilitar logs detallados
socket.on('connect', () => console.log('Connected:', socket.id))
socket.on('disconnect', () => console.log('Disconnected'))
socket.on('error', (err) => console.error('Socket error:', err))
```

### 2. Estado de Zustand
```javascript
// Ver estado en DevTools
// 1. Instalar Redux DevTools Extension
// 2. El estado aparecerá automáticamente
```

### 3. Problemas de Renderizado
```typescript
// Usar React DevTools Profiler
// Agregar logs estratégicos
console.log('Render:', { props, state })
```

## 📋 Checklist Pre-Deploy

- [ ] Todas las features funcionan en desarrollo
- [ ] No hay errores en consola
- [ ] Las pruebas pasan (cuando estén implementadas)
- [ ] El build de producción funciona: `npm run build`
- [ ] Variables de entorno configuradas
- [ ] Performance aceptable (< 3s carga inicial)
- [ ] Funciona en móviles
- [ ] Accesibilidad verificada

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar desarrollo
npm run dev:next     # Solo Next.js (sin WebSocket)

# Build y Deploy
npm run build        # Build de producción
npm run start        # Iniciar producción

# Calidad de Código
npm run lint         # Ejecutar linter
npm run lint:fix     # Arreglar problemas de lint

# Limpiar
rm -rf .next         # Limpiar build cache
rm -rf node_modules  # Reinstalar dependencias
```

## 🚨 Solución de Problemas Comunes

### Puerto 3004 en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3004
# Matar proceso
kill -9 [PID]
```

### Errores de Firebase
- Verificar configuración en `.env.local`
- Revisar reglas de seguridad en Firebase Console
- Verificar que los servicios estén habilitados

### WebSocket no conecta
- Verificar que el servidor esté corriendo
- Revisar firewall/antivirus
- Probar con `http://localhost:3004` en lugar de IP

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)