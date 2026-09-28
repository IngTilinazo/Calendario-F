import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { getUserProfile } from '../firebase/db'
import { getFamilyEvents, createEvent, updateEvent, deleteEvent } from '../firebase/db'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [familyId, setFamilyId] = useState(null)

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        const result = await getUserProfile(auth.currentUser.uid)
        if (result.success) {
          setFamilyId(result.user.familyId)
        }
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    if (!familyId) return

    const unsubscribe = getFamilyEvents(familyId, (eventsData) => {
      setEvents(eventsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [familyId])

  const addEvent = async (eventData) => {
    const result = await createEvent({
      ...eventData,
      familyId,
      createdBy: auth.currentUser?.uid
    })
    return result
  }

  const editEvent = async (eventId, eventData) => {
    const result = await updateEvent(eventId, eventData)
    return result
  }

  const removeEvent = async (eventId) => {
    const result = await deleteEvent(eventId)
    return result
  }

  return {
    events,
    loading,
    addEvent,
    editEvent,
    removeEvent,
    familyId
  }
}
