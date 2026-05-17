import { useState } from 'react'

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const turnosExistentes = [
    { fecha: '2024-01-20', empleado: 'Ana García', hora: '09:00', tipo: 'Mañana' },
    { fecha: '2024-01-20', empleado: 'Carlos López', hora: '14:00', tipo: 'Tarde' },
    { fecha: '2024-01-21', empleado: 'María Martínez', hora: '09:00', tipo: 'Mañana' },
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getTurnosDelDia = (fecha) => {
    if (!fecha) return []
    const fechaStr = fecha.toISOString().split('T')[0]
    return turnosExistentes.filter(turno => turno.fecha === fechaStr)
  }

  const cambiarMes = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1))
  }

  const days = getDaysInMonth(currentDate)
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendario de Turnos</h2>
        <div className="flex gap-2">
          <button
            onClick={() => cambiarMes(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>◀</span>
          </button>
          <span className="text-xl font-semibold px-4">
            {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => cambiarMes(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>▶</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const turnosDelDia = getTurnosDelDia(day)
          const isToday = day && day.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg ${
                day ? 'bg-white hover:shadow-md transition-shadow' : 'bg-gray-50'
              } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {turnosDelDia.map((turno, idx) => (
                      <div key={idx} className="text-xs p-1 rounded bg-blue-50">
                        <div className="flex items-center gap-1 text-blue-700">
                          <span>⏰</span>
                          <span>{turno.hora}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <span>👤</span>
                          <span className="truncate">{turno.empleado.split(' ')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendario