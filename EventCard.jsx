import { Trash2, Edit, Calendar, Clock } from 'lucide-react'

const CATEGORY_COLORS = {
  'Cumpleaños': 'bg-pink-500',
  'Citas Médicas': 'bg-red-500',
  'Pagos': 'bg-yellow-500',
  'Eventos Familiares': 'bg-green-500',
  'Recordatorios': 'bg-blue-500',
  'Otros': 'bg-gray-500'
}

function EventCard({ event, onEdit, onDelete }) {
  const categoryColor = CATEGORY_COLORS[event.category] || 'bg-gray-500'
  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  })

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`w-3 h-3 rounded-full ${categoryColor}`}></span>
            <span className="text-xs text-gray-500">{event.category}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {event.time && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
          )}

          {event.reminders && event.reminders.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {event.reminders.map(reminder => (
                <span key={reminder} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {reminder === '1week' && '1 semana'}
                  {reminder === '3days' && '3 días'}
                  {reminder === '1day' && '1 día'}
                  {reminder === 'sameday' && 'Mismo día'}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventCard
