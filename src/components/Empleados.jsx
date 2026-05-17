import { useState, useEffect } from 'react'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'Empleado'
  })

  // Cargar empleados desde la API
  useEffect(() => {
    fetchEmpleados()
  }, [])

  const fetchEmpleados = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/empleados')
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setEmpleados(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar empleados:', error)
      setError('No se pudieron cargar los empleados')
      setEmpleados([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = '/api/empleados'
      const method = editando ? 'PUT' : 'POST'
      const body = editando 
        ? { ...formData, id: editando } 
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchEmpleados()
        setShowModal(false)
        setEditando(null)
        setFormData({ nombre: '', email: '', telefono: '', rol: 'Empleado' })
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar el empleado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al conectar con el servidor')
    }
  }

  const handleEdit = (empleado) => {
    setEditando(empleado.id)
    setFormData({
      nombre: empleado.nombre,
      email: empleado.email,
      telefono: empleado.telefono,
      rol: empleado.rol
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este empleado?')) {
      try {
        const response = await fetch('/api/empleados', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          fetchEmpleados()
        } else {
          const error = await response.json()
          alert(error.error || 'Error al eliminar el empleado')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al conectar con el servidor')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando empleados...</p>
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
            onClick={fetchEmpleados}
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
        <h2 className="text-2xl font-bold text-gray-800">Empleados</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>👤➕</span>
          Agregar Empleado
        </button>
      </div>

      {empleados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-500">No hay empleados registrados</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Agregar el primer empleado
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empleados.map((empleado) => (
            <div key={empleado.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-600 p-2 rounded-full">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(empleado)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <span>✏️</span>
                  </button>
                  <button
                    onClick={() => handleDelete(empleado.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{empleado.nombre}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="truncate">{empleado.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{empleado.telefono}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  empleado.rol === 'Administrador' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {empleado.rol}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar empleado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editando ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
              >
                <option value="Empleado">Empleado</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditando(null)
                  setFormData({ nombre: '', email: '', telefono: '', rol: 'Empleado' })
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

export default Empleados