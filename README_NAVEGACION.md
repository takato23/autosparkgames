# 🎮 AutoSpark - Guía de Navegación

## Estructura Simplificada

AutoSpark está organizado en **3 áreas principales** para mantener todo ordenado y fácil de usar:

### 🎯 **Página Principal** (`/`)
- **Crear Juego** → Lleva a `/presenter` (área del presentador)
- **Unirse** → Lleva a `/join` (área del participante)
- Enlaces rápidos a demos y showcase

### 🎮 **Área del Presentador** (`/presenter`)
El presentador es quien **crea, configura y dirige** los juegos:

- **Dashboard** (`/presenter`) - Panel principal con todas las presentaciones
- **Nueva Presentación** (`/presenter/new`) - Crear juego desde cero
- **Templates** (`/presenter/templates`) - Plantillas predefinidas
- **Sesión Activa** (`/presenter/session/[code]`) - Dirigir juego en vivo
- **Configuración** (`/presenter/settings`) - Ajustes del presentador

### 👥 **Área del Participante** (`/join`)
Los participantes **se unen y juegan**:

- **Unirse** (`/join`) - Entrar con código o QR
- **Participante** (`/participant`) - Panel del participante
- **Sesión** (`/session/[code]`) - Vista de juego activo

### 🎯 **Demos y Testing**
- **Demo** (`/demo`) - Demostración interactiva
- **Showcase** (`/showcase`) - Muestra de funcionalidades
- **Quick Test** (`/quick-test`) - Pruebas rápidas
- **Test Components** (`/test-components`) - Testing de componentes

### ⚙️ **Administración** (`/admin`)
- **Admin** (`/admin`) - Panel administrativo
- **Moderación** (`/admin/moderation`) - Herramientas de moderación

## Flujo de Uso Típico

### Para Presentadores:
1. Ir a `/` → "Crear Juego"
2. Crear presentación en `/presenter/new`
3. Configurar en `/presenter`
4. Iniciar sesión en `/presenter/session/[code]`

### Para Participantes:
1. Ir a `/` → "Unirse"
2. Ingresar código en `/join`
3. Participar en `/session/[code]`

## 🗺️ Mapa de Navegación

Visita `/navigation-map` para ver todas las rutas disponibles de forma visual y organizada.

## Características Mantenidas

✅ **Todo el diseño original** - Sin cambios visuales  
✅ **Todos los juegos** - Bingo, Pictionary, Trivia, etc.  
✅ **Todas las funcionalidades** - Presentaciones, sesiones, etc.  
✅ **Tema oscuro** - Completamente soportado  
✅ **Responsive** - Funciona en móvil y desktop  

## Mejoras Implementadas

🔄 **Navegación más clara** - Rutas intuitivas  
🔄 **Separación de roles** - Presentador vs Participante  
🔄 **Organización visual** - Mapa de navegación  
🔄 **Enlaces rápidos** - Acceso directo a funciones principales  

---

**Nota**: Esta reorganización mantiene toda la funcionalidad existente, solo mejora la navegación y organización. 