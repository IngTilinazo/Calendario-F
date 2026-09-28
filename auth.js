import { auth } from './config'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'

// Registrar usuario
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Aquí podrías guardar el displayName en Firestore
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Cerrar sesión
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Observar cambios de autenticación
export const authStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback)
}
