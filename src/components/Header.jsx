import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Header = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  // Obtener color según rol
  const getRoleColor = (rol) => {
    switch(rol) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'supervisor': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <span className="text-white text-2xl">⏰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Gestión de Turnos
              </h1>
              <p className="text-xs text-gray-500">
                {session?.user?.empresaId === 1 ? 'Mi Empresa' : 'Empresa'}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {session?.user?.name}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(session?.user?.role)}`}>
                  {session?.user?.role === 'admin' ? 'Administrador' : 
                   session?.user?.role === 'supervisor' ? 'Supervisor' : 'Empleado'}
                </span>
              </div>
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header