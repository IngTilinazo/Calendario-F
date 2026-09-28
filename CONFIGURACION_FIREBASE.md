# Guía de Configuración de Firebase

Sigue estos pasos para configurar Firebase para tu Calendario Familiar.

## Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Create project"
3. Ingresa un nombre para tu proyecto (ej: "calendario-familiar")
4. Acepta los términos y haz clic en "Continuar"
5. Desactiva Google Analytics (opcional, no es necesario para este proyecto)
6. Haz clic en "Crear proyecto"
7. Espera a que se cree el proyecto (puede tomar unos minutos)

## Paso 2: Habilitar Authentication

1. En el menú izquierdo, haz clic en "Authentication"
2. Haz clic en "Comenzar" o "Get started"
3. En la pestaña "Sign-in method", haz clic en "Email/Password"
4. Habilita la opción "Email/Password"
5. Haz clic en "Guardar"

## Paso 3: Crear Firestore Database

1. En el menú izquierdo, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona una ubicación (recomendado: "nam5 (us-central)")
4. Elige "Start in Test Mode" para desarrollo
5. Haz clic en "Habilitar"

## Paso 4: Configurar reglas de seguridad de Firestore

1. En Firestore Database, ve a la pestaña "Reglas"
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Haz clic en "Publicar"

## Paso 5: Obtener credenciales de la app web

1. En el menú izquierdo, haz clic en el ícono de engranaje (⚙️) junto a "Project Overview"
2. Selecciona "Configuración del proyecto" o "Project settings"
3. Ve a la pestaña "General"
4. Desplázate hasta la sección "Tus apps" o "Your apps"
5. Haz clic en el icono de web (</>)
6. Ingresa un nombre para la app (ej: "Calendario Web")
7. NO marques "Firebase Hosting" (lo haremos con Vercel)
8. Haz clic en "Registrar app"
9. Copia el objeto `firebaseConfig` que se muestra

## Paso 6: Configurar el proyecto

1. Abre el archivo `src/firebase/config.js`
2. Reemplaza los valores de `firebaseConfig` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_ID_DE_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
}
```

## Paso 7: Instalar dependencias y ejecutar

1. En la terminal, navega al proyecto:
```bash
cd calendario-familiar
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Paso 8: Habilitar Cloud Messaging (Notificaciones Push)

1. En el menú izquierdo de Firebase Console, haz clic en "Cloud Messaging"
2. Haz clic en "Comenzar" o "Get started"
3. Copia el "Server Key" o "Sender ID" (lo necesitarás más adelante)

## Paso 9: Configurar VAPID Key para notificaciones web

1. En Firebase Console → Project Settings → Cloud Messaging
2. En la sección "Web configuration", haz clic en "Generate key pair"
3. Copia la clave pública (VAPID Key)
4. Abre el archivo `src/hooks/useNotifications.js`
5. Reemplaza `TU_VAPID_KEY` con tu clave pública

## Solución de problemas

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que tu API Key sea correcta en `src/firebase/config.js`

### Error: "Firebase: Error (auth/email-already-in-use)"
- El email ya está registrado. Usa otro email o inicia sesión

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore en Firebase Console
- Asegúrate de que estén configuradas como se indica en el Paso 4

### Las notificaciones no funcionan
- Las notificaciones push solo funcionan en HTTPS o localhost
- Verifica que hayas configurado la VAPID Key en el Paso 9
- Asegúrate de haber aceptado el permiso de notificaciones en el navegador
- Revisa la consola del navegador para ver si hay errores de Firebase

### Error al instalar dependencias
- Asegúrate de tener Node.js instalado (versión 16 o superior)
- Intenta borrar `node_modules` y `package-lock.json` y vuelve a instalar

## Siguientes pasos (Opcionales)

Una vez que todo funcione localmente:

1. **Deploy en Vercel** (gratis):
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz deploy y obtendrás una URL HTTPS

2. **Instalar como app móvil**:
   - Abre la URL en tu celular
   - En Chrome: "Agregar a pantalla de inicio"
   - En Safari: "Compartir" → "Agregar a inicio"

## Costos

- **Firebase Plan Spark**: Gratis (hasta ciertos límites, suficiente para uso personal)
- **Vercel**: Gratis para proyectos personales
- **Dominio**: Opcional (~$10-15/año si quieres uno personalizado)

## Soporte

Si tienes problemas, revisa la documentación oficial de Firebase:
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
