# Calendario Familiar

Aplicación web y PWA de calendario familiar con sincronización en tiempo real, soporte offline y notificaciones push.

## Características

- 📅 **Calendario interactivo** con vista mensual
- 👨‍👩‍👧‍👦 **Sincronización en tiempo real** entre hasta 5 usuarios
- 🔔 **Notificaciones push** configurables (1 semana, 3 días, 1 día, mismo día)
- 🏷️ **Categorías personalizadas** con colores
- 📱 **PWA** - Se instala como app móvil sin app stores
- 🌐 **Soporte offline** - Funciona sin conexión a internet
- 🔐 **Autenticación segura** con Firebase
- 🎨 **Interfaz moderna** y responsive

## Tecnologías

- **Frontend**: React + Vite
- **Backend**: Firebase (Authentication, Firestore, Cloud Messaging)
- **Estilos**: TailwindCSS
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **PWA**: vite-plugin-pwa

## Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd calendario-familiar
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → Email/Password
4. Habilita **Firestore Database**
5. Habilita **Cloud Messaging**
6. Copia las credenciales y reemplázalas en `src/firebase/config.js`

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
}
```

### 4. Configurar reglas de Firestore

En Firebase Console → Firestore → Reglas:

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

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

### 6. Build para producción

```bash
npm run build
```

### 7. Deploy

Puedes deployar en:
- **Vercel** (gratis)
- **Netlify** (gratis)
- **Firebase Hosting** (gratis)

## Uso

### Registro

1. La primera persona que se registre crea una nueva familia
2. El código de familia se muestra en el dashboard
3. Comparte el código con otros miembros para que se unan

### Crear Eventos

1. Haz clic en "Nuevo Evento" o selecciona una fecha en el calendario
2. Completa los detalles del evento
3. Selecciona las categorías y recordatorios
4. Guarda el evento

### Notificaciones

Las notificaciones se configuran por evento:
- 1 semana antes
- 3 días antes
- 1 día antes
- El mismo día (1 hora antes)

Puedes seleccionar múltiples opciones.

### Instalar como App Móvil

1. Abre la app en tu navegador móvil
2. En Chrome: Toca "Agregar a pantalla de inicio"
3. En Safari: Toca "Compartir" → "Agregar a inicio"
4. La app se instalará como una app nativa

## Estructura del Proyecto

```
calendario-familiar/
├── public/
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Calendar.jsx
│   │   ├── EventModal.jsx
│   │   └── EventCard.jsx
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── db.js
│   ├── hooks/
│   │   ├── useEvents.js
│   │   ├── useNotifications.js
│   │   └── useOffline.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Costos

- **Desarrollo**: Gratis
- **Hosting**: Gratis (Vercel/Netlify)
- **Firebase**: Plan Spark (gratis) - suficiente para uso personal
- **Dominio**: Opcional (puedes usar dominio gratis)

## Limitaciones

- Máximo 5 usuarios por familia
- Requiere conexión a internet para sincronización inicial
- Las notificaciones push requieren HTTPS o localhost

## Soporte

Para problemas o preguntas, contacta al desarrollador.

## Licencia

Proyecto de uso personal e interpersonal.
