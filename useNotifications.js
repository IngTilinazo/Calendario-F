import { useState, useEffect } from 'react'
import { messaging } from '../firebase/config'
import { getToken, onMessage } from 'firebase/messaging'

export const useNotifications = () => {
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const [permission, setPermission] = useState('default')

  useEffect(() => {
    if (!messaging) return

    // Solicitar permiso de notificación
    const requestPermission = async () => {
      try {
        const currentPermission = Notification.permission
        setPermission(currentPermission)

        if (currentPermission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BIwAxVXqR1jSn0-yrx72ftPCy0ZLN-AR50EDx_F6viPQ4k72v0PGgmxTVMQ4Vgji9_vQ9ZTPiI0kryUx_YmK6GQ'
          })
          setToken(currentToken)
        } else if (currentPermission === 'default') {
          const newPermission = await Notification.requestPermission()
          setPermission(newPermission)
          
          if (newPermission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: 'BIwAxVXqR1jSn0-yrx72ftPCy0ZLN-AR50EDx_F6viPQ4k72v0PGgmxTVMQ4Vgji9_vQ9ZTPiI0kryUx_YmK6GQ'
            })
            setToken(currentToken)
          }
        }
      } catch (error) {
        console.error('Error al solicitar permiso de notificación:', error)
      }
    }

    requestPermission()

    // Escuchar mensajes en primer plano
    const unsubscribe = onMessage(messaging, (payload) => {
      setNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
        data: payload.data
      })
    })

    return () => unsubscribe()
  }, [])

  const requestNotificationPermission = async () => {
    if (!messaging) return null

    try {
      const newPermission = await Notification.requestPermission()
      setPermission(newPermission)

      if (newPermission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: 'BIwAxVXqR1jSn0-yrx72ftPCy0ZLN-AR50EDx_F6viPQ4k72v0PGgmxTVMQ4Vgji9_vQ9ZTPiI0kryUx_YmK6GQ'
        })
        setToken(currentToken)
        return currentToken
      }
      return null
    } catch (error) {
      console.error('Error al solicitar permiso:', error)
      return null
    }
  }

  return {
    token,
    notification,
    permission,
    requestNotificationPermission
  }
}
