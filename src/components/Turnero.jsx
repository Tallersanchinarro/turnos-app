import { useState, useEffect } from 'react'

const Turnero = () => {
  const [turnos, setTurnos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [nuevoTurno, setNuevoTurno] = useState({
    empleado: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    tipo: 'Mañana'
  })

  // Cargar turnos y empleados al iniciar
  useEffect(() => {
    fetchTurnos()
    fetchEmpleados()
  }, [])

  const fetchTurnos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/turnos')
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      // Asegurar que data sea un array
      setTurnos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar turnos:', error)
      setError('No se pudieron cargar los turnos')
      setTurnos([]) // Asegurar que sea un array vacío
    } finally {
      setLoading(false)
    }
  }

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('/api/empleados')
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setEmpleados(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar empleados:', error)
      setEmpleados([])
    }
  }

  const eliminarTurno = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      try {
        const response = await fetch('/api/turnos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          fetchTurnos() // Recargar la lista
        } else {
          const error = await response.json()
          alert(error.error || 'Error al eliminar el turno')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al conectar con el servidor')
      }
    }
  }

  const agregarTurno = async () => {
    if (!nuevoTurno.empleado || !nuevoTurno.fecha || !nuevoTurno.horaInicio || !nuevoTurno.horaFin) {
      alert('Por favor, completa todos los campos')
      return
    }

    try {
      const response = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTurno)
      })

      if (response.ok) {
        fetchTurnos() // Recargar la lista
        setShowModal(false)
        setNuevoTurno({ 
          empleado: '', 
          fecha: '', 
          horaInicio: '', 
          horaFin: '', 
          tipo: 'Mañana' 
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear el turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    }
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES')
  }

  // Filtrar turnos para mostrar solo los más recientes primero
  const turnosOrdenados = Array.isArray(turnos) ? [...turnos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) : []

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando turnos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTurnos}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Turnos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>➕</span>
          Nuevo Turno
        </button>
      </div>

      {turnosOrdenados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500">No hay turnos registrados</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Crear el primer turno
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {turnosOrdenados.map((turno) => (
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
                        turno.tipo === 'Mañana' 
                          ? 'bg-green-100 text-green-700' 
                          : turno.tipo === 'Tarde'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {turno.tipo}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 ml-11">
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>📅</span>
                      <span className="text-sm">{formatearFecha(turno.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>⏰</span>
                      <span className="text-sm">{turno.hora_inicio} - {turno.hora_fin}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => eliminarTurno(turno.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Eliminar turno"
                >
                  <span>🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para nuevo turno */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Nuevo Turno</h3>
            <div className="space-y-4">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.empleado}
                onChange={(e) => setNuevoTurno({...nuevoTurno, empleado: e.target.value})}
                required
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.nombre}>{emp.nombre}</option>
                ))}
              </select>
              
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.fecha}
                onChange={(e) => setNuevoTurno({...nuevoTurno, fecha: e.target.value})}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevoTurno.horaInicio}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, horaInicio: e.target.value})}
                  required
                />
                <input
                  type="time"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevoTurno.horaFin}
                  onChange={(e) => setNuevoTurno({...nuevoTurno, horaFin: e.target.value})}
                  required
                />
              </div>
              
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nuevoTurno.tipo}
                onChange={(e) => setNuevoTurno({...nuevoTurno, tipo: e.target.value})}
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={agregarTurno}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setNuevoTurno({ 
                    empleado: '', 
                    fecha: '', 
                    horaInicio: '', 
                    horaFin: '', 
                    tipo: 'Mañana' 
                  })
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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