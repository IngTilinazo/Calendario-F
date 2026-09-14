import { useState } from 'react'
import { X, Calendar, Clock, Tag, Bell } from 'lucide-react'

const CATEGORIES = [
  { name: 'Cumpleaños', color: 'bg-pink-500' },
  { name: 'Citas Médicas', color: 'bg-red-500' },
  { name: 'Pagos', color: 'bg-yellow-500' },
  { name: 'Eventos Familiares', color: 'bg-green-500' },
  { name: 'Recordatorios', color: 'bg-blue-500' },
  { name: 'Otros', color: 'bg-gray-500' }
]

const REMINDER_OPTIONS = [
  { value: '1week', label: '1 semana antes' },
  { value: '3days', label: '3 días antes' },
  { value: '1day', label: '1 día antes' },
  { value: 'sameday', label: 'El mismo día (1 hora antes)' }
]

function EventModal({ isOpen, onClose, onSubmit, event = null }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.time || '',
    category: event?.category || 'Otros',
    description: event?.description || '',
    reminders: event?.reminders || []
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString()
    })
    onClose()
  }

  const handleReminderToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.includes(value)
        ? prev.reminders.filter(r => r !== value)
        : [...prev.reminders, value]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Ej: Cumpleaños de mamá"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Fecha
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Hora (opcional)
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bell className="inline w-4 h-4 mr-1" />
              Recordatorios
            </label>
            <div className="space-y-2">
              {REMINDER_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.reminders.includes(option.value)}
                    onChange={() => handleReminderToggle(option.value)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {event ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
