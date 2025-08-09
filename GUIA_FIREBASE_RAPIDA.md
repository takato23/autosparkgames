# 🔥 Configuración Rápida de Firebase (5 minutos)

## ⚡ Pasos Rápidos

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console]( )
2. **"Crear proyecto"** → Nombre: `autospark-games`
3. **Desactivar Google Analytics** (opcional)
4. **Crear proyecto**

### 2. Habilitar Firestore
1. En el dashboard → **"Firestore Database"**
2. **"Crear base de datos"**
3. **Modo de prueba** (30 días gratis)
4. **Ubicación**: `us-central1` (más rápida)

### 3. Obtener Credenciales
1. **Configuración del proyecto** (⚙️) → **General**
2. **"Agregar app"** → **Web** → Nombre: `autospark-web`
3. **Copiar configuración**

### 4. Crear .env.local
En la raíz del proyecto, crea `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Reiniciar Servidor
```bash
npm run dev
```

## ✅ ¡Listo!

Ahora tendrás:
- ✅ Unirse a sesiones funcionando
- ✅ Crear presentaciones
- ✅ Tiempo real con WebSocket
- ✅ Base de datos en la nube

## 🔧 Comandos Útiles

```bash
# Matar proceso en puerto 3004
lsof -ti:3004 | xargs kill -9

# Iniciar servidor
npm run dev

# Solo Next.js (sin WebSocket)
npm run dev:next
```

## 🆘 Si Algo Sale Mal

1. **Verificar credenciales** en `.env.local`
2. **Reiniciar servidor** completamente
3. **Limpiar caché**: `rm -rf .next`
4. **Reinstalar dependencias**: `npm install`

---

**¿Prefieres Supabase?** Te ayudo a migrar, pero Firebase es más rápido con tu setup actual. 