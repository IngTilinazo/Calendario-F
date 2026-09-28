import { db } from './config'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

// Referencias a las colecciones
const eventsCollection = collection(db, 'events')
const usersCollection = collection(db, 'users')

// ========== EVENTOS ==========

// Crear evento
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Actualizar evento
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Eliminar evento
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    await deleteDoc(eventRef)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Obtener evento por ID
export const getEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    const eventSnap = await getDoc(eventRef)
    if (eventSnap.exists()) {
      return { success: true, event: { id: eventSnap.id, ...eventSnap.data() } }
    }
    return { success: false, error: 'Evento no encontrado' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Obtener todos los eventos de una familia
export const getFamilyEvents = (familyId, callback) => {
  const q = query(
    eventsCollection,
    where('familyId', '==', familyId),
    orderBy('date', 'asc')
  )
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(events)
  }, (error) => {
    console.error('Error al obtener eventos:', error)
    callback([])
  })
  
  return unsubscribe
}

// ========== USUARIOS ==========

// Crear perfil de usuario
export const createUserProfile = async (userData) => {
  try {
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Obtener perfil de usuario
export const getUserProfile = async (userId) => {
  try {
    const q = query(usersCollection, where('uid', '==', userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      return { success: true, user: { id: userDoc.id, ...userDoc.data() } }
    }
    return { success: false, error: 'Usuario no encontrado' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Obtener usuarios de una familia
export const getFamilyUsers = async (familyId) => {
  try {
    const q = query(usersCollection, where('familyId', '==', familyId))
    const querySnapshot = await getDocs(q)
    
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return { success: true, users }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Verificar si la familia tiene menos de 5 usuarios
export const checkFamilyCapacity = async (familyId) => {
  try {
    const result = await getFamilyUsers(familyId)
    if (result.success) {
      return { success: true, canAdd: result.users.length < 5 }
    }
    return { success: false, error: result.error }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
