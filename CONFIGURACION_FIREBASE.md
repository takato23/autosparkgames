# 🔥 Configuración de Firebase

## Error 500 en `/join` - Solución

El error 500 que estás viendo en la página `/join` se debe a que Firebase no está configurado. Aquí te explico cómo solucionarlo:

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Firestore Database
4. Habilita Authentication (opcional, para funcionalidades avanzadas)

### 2. Obtener Credenciales
1. En Firebase Console, ve a **Configuración del proyecto** > **General**
2. En la sección "Tus apps", haz clic en **Agregar app** > **Web**
3. Dale un nombre a tu app (ej: "autospark-web")
4. Copia las credenciales de configuración

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Development Settings
NODE_ENV=development
```

### 4. Configurar Reglas de Firestore
En Firebase Console, ve a **Firestore Database** > **Reglas** y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Nota**: Estas reglas permiten acceso total. Para producción, configura reglas más restrictivas.

### 5. Reiniciar el Servidor
```bash
npm run dev
```

## 🎯 Funcionalidades que se Habilitarán

Una vez configurado Firebase, tendrás acceso a:

- ✅ **Unirse a sesiones** con código
- ✅ **Crear presentaciones** como presentador
- ✅ **Sesiones en tiempo real** con WebSocket
- ✅ **Almacenamiento de datos** en Firestore
- ✅ **Autenticación de usuarios** (opcional)

## 🔧 Estado Actual

- **Página principal**: ✅ Funcionando
- **Mapa de navegación**: ✅ Funcionando  
- **Página de unirse**: ⚠️ Modo demo (requiere Firebase)
- **Área del presentador**: ⚠️ Modo demo (requiere Firebase)

## 🚀 Próximos Pasos

1. Configura Firebase siguiendo los pasos arriba
2. Reinicia el servidor de desarrollo
3. Prueba la funcionalidad de unirse
4. Explora todas las características de AutoSpark

---

**¿Necesitas ayuda?** Revisa la documentación de Firebase o consulta los logs del servidor para más detalles. 