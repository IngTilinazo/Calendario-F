import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getUserProfile } from '../firebase/db'
import Calendar from '../components/Calendar'
import EventModal from '../components/EventModal'
import EventCard from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'
import { useOffline } from '../hooks/useOffline'
import { Plus, LogOut, Users, Wifi, WifiOff, Bell } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

function Dashboard() {
  const navigate = useNavigate()
  const { events, loading, addEvent, editEvent, removeEvent, familyId } = useEvents()
  const isOnline = useOffline()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (auth.currentUser) {
        const result = await getUserProfile(auth.currentUser.uid)
        if (result.success) {
          setUserProfile(result.user)
        }
      }
    }
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await firebaseSignOut(auth)
    navigate('/login')
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowModal(true)
    setEditingEvent(null)
  }

  const handleAddEvent = () => {
    setShowModal(true)
    setEditingEvent(null)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowModal(true)
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      await removeEvent(eventId)
    }
  }

  const handleSubmitEvent = async (eventData) => {
    if (editingEvent) {
      await editEvent(editingEvent.id, eventData)
    } else {
      await addEvent(eventData)
    }
  }

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return isSameDay(eventDate, selectedDate)
  })

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Calendario Familiar</h1>
              <p className="text-sm text-gray-500">
                {userProfile?.name || 'Usuario'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Connection Status */}
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </h2>
              <button
                onClick={handleAddEvent}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Evento</span>
              </button>
            </div>

            <Calendar 
              events={events} 
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />

            {/* Events for selected date */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Eventos del día
              </h3>
              
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg">
                  <p className="text-gray-500">No hay eventos para este día</p>
                  <button
                    onClick={handleAddEvent}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Agregar evento
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Family Code */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Código de Familia</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm text-gray-700">{familyId}</code>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Comparte este código con tu familia para que puedan unirse
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Próximos Eventos
              </h3>
              
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No hay próximos eventos</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Bell className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), 'd MMM', { locale: es })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de eventos</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Eventos este mes</span>
                  <span className="font-medium">
                    {events.filter(e => {
                      const eventDate = new Date(e.date)
                      const now = new Date()
                      return eventDate.getMonth() === now.getMonth() && 
                             eventDate.getFullYear() === now.getFullYear()
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingEvent(null)
        }}
        onSubmit={handleSubmitEvent}
        event={editingEvent}
      />
    </div>
  )
}

export default Dashboard
