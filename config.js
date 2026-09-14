import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

// Configuración de Firebase
const firebaseConfig = {
   apiKey: "AIzaSyC4XtWCl48V-0dShv_ZbqYAhBci-0G2qJA",
  authDomain: "calendario-familiar-23752.firebaseapp.com",
  projectId: "calendario-familiar-23752",
  storageBucket: "calendario-familiar-23752.firebasestorage.app",
  messagingSenderId: "912104786454",
  appId: "1:912104786454:web:43dfbb30454548af884337"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Inicializar Messaging (solo en HTTPS o localhost)
let messaging = null
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.log('Messaging no disponible:', error)
  }
}

export { app, auth, db, messaging }
