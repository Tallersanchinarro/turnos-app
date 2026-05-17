import { useState } from 'react'

const Turnero = () => {
  const [turnos, setTurnos] = useState([
    {
      id: 1,
      empleado: 'Ana García',
      fecha: '2024-01-20',
      horaInicio: '09:00',
      horaFin: '17:00',
      tipo: 'Mañana'
    },
    {
      id: 2,
      empleado: 'Carlos López',
      fecha: '2024-01-20',
      horaInicio: '14:00',
      horaFin: '22:00',
      tipo: 'Tarde'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [nuevoTurno, setNuevoTurno] = useState({
    empleado: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    tipo: 'Mañana'
  })

  const empleadosDisponibles = [
    'Ana García', 'Carlos López', 'María Martínez', 
    'José Rodríguez', 'Laura Sánchez', 'Pablo Gómez'
  ]

  const eliminarTurno = (id) => {
    setTurnos(turnos.filter(turno => turno.id !== id))
  }

  const agregarTurno = () => {
    if (nuevoTurno.empleado && nuevoTurno.fecha && nuevoTurno.horaInicio && nuevoTurno.horaFin) {
      setTurnos([...turnos, { ...nuevoTurno, id: Date.now() }])
      setShowModal(false)
      setNuevoTurno({ empleado: '', fecha: '', horaInicio: '', horaFin: '', tipo: 'Mañana' })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Turnos del día</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>➕</span>
          Nuevo Turno
        </button>
      </div>

      <div className="grid gap-4">
        {turnos.map((turno) => (
          <div key={turno.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-blue-600 text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{turno.empleado}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      turno.tipo === 'Mañana' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {turno.tipo}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 ml-11">
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>📅</span>
                    <span className="text-sm">{turno.fecha}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>⏰</span>
                    <span className="text-sm">{turno.horaInicio} - {turno.horaFin}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => eliminarTurno(turno.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <span>🗑️</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Nuevo Turno</h3>
            <div className="space-y-4">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.empleado}
                onChange={(e) => setNuevoTurno({...nuevoTurno, empleado: e.target.value})}
              >
                <option value="">Seleccionar empleado</option>
                {empleadosDisponibles.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.fecha}
                onChange={(e) => setNuevoTurno({...nuevoTurno, fecha: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevoTurno.horaInicio}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, horaInicio: e.target.value})}
                />
                <input
                  type="time"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevoTurno.horaFin}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, horaFin: e.target.value})}
                />
              </div>
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.tipo}
                onChange={(e) => setNuevoTurno({...nuevoTurno, tipo: e.target.value})}
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={agregarTurno}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Turnero