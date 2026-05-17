import { useState } from 'react'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: 'Ana García', email: 'ana@empresa.com', telefono: '666111222', rol: 'Administrador' },
    { id: 2, nombre: 'Carlos López', email: 'carlos@empresa.com', telefono: '666333444', rol: 'Empleado' },
    { id: 3, nombre: 'María Martínez', email: 'maria@empresa.com', telefono: '666555666', rol: 'Empleado' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'Empleado'
  })

  const handleSubmit = () => {
    if (editando) {
      setEmpleados(empleados.map(emp => 
        emp.id === editando ? { ...formData, id: editando } : emp
      ))
    } else {
      setEmpleados([...empleados, { ...formData, id: Date.now() }])
    }
    setShowModal(false)
    setEditando(null)
    setFormData({ nombre: '', email: '', telefono: '', rol: 'Empleado' })
  }

  const handleEdit = (empleado) => {
    setEditando(empleado.id)
    setFormData(empleado)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este empleado?')) {
      setEmpleados(empleados.filter(emp => emp.id !== id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Empleados</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <span>👤➕</span>
          Agregar Empleado
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empleados.map((empleado) => (
          <div key={empleado.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <span className="text-white text-xl">👤</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(empleado)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <span>✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(empleado.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <span>🗑️</span>
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">{empleado.nombre}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>{empleado.email}</span>
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
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditando(null)
                }}
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

export default Empleados