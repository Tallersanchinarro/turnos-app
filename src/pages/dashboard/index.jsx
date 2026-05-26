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
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {session?.user?.name}
          </h1>
          <p className="text-gray-500">Panel de control</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Turnos</h3>
            <p className="text-gray-500">Gestionar turnos</p>
          </Link>

          <Link href="/empleados" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Empleados</h3>
            <p className="text-gray-500">Administrar personal</p>
          </Link>

          <Link href="/calendario" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Calendario</h3>
            <p className="text-gray-500">Ver calendario</p>
          </Link>
        </div>
      </div>
    </div>
  )
}