import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState({
    empleados: 0,
    turnosHoy: 0,
    turnosSemana: 0,
    ausencias: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/dashboard/metrics')
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error al cargar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    { href: '/turnos', icon: '📋', title: 'Turnos', description: 'Gestionar turnos de trabajo', color: 'bg-blue-500' },
    { href: '/empleados', icon: '👥', title: 'Empleados', description: 'Administrar personal', color: 'bg-green-500' },
    { href: '/calendario', icon: '📅', title: 'Calendario', description: 'Ver calendario de turnos', color: 'bg-purple-500' },
  ]

  if (session?.user?.role === 'admin' || session?.user?.role === 'supervisor') {
    menuItems.unshift({ href: '/dashboard/metrics', icon: '📊', title: 'Métricas', description: 'Estadísticas y reportes', color: 'bg-orange-500' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {session?.user?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Panel de control - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Empleados</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : metrics.empleados}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Turnos Hoy</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : metrics.turnosHoy}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Turnos Semana</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : metrics.turnosSemana}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ausencias</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? '...' : metrics.ausencias}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}