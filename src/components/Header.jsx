const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <span className="text-white text-2xl">⏰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestión de Turnos
              </h1>
              <p className="text-sm text-gray-500">
                Control horario para equipos pequeños
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>Máx. 6 empleados</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header