import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

function Calendar({ events, onDateClick, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return isSameDay(eventDate, day)
    })
  }

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={goToToday}
        className="w-full mb-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        Hoy
      </button>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(day => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isDayToday = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                relative p-2 rounded-lg transition-all
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900 hover:bg-gray-100'}
                ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                ${isDayToday && !isSelected ? 'bg-primary-100 font-bold' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              
              {dayEvents.length > 0 && (
                <div className="flex justify-center mt-1 space-x-0.5">
                  {dayEvents.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-primary-500'
                      }`}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className={`text-xs ${isSelected ? 'text-white' : 'text-primary-600'}`}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
