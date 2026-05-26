import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'

export default function MetricsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Métricas y Estadísticas</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Resumen General</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Empleados:</span>
                  <span className="font-bold">{metrics?.empleados || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Turnos Hoy:</span>
                  <span className="font-bold">{metrics?.turnosHoy || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Turnos Semana:</span>
                  <span className="font-bold">{metrics?.turnosSemana || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ausencias:</span>
                  <span className="font-bold text-red-600">{metrics?.ausencias || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">📈 Próximos Pasos</h2>
              <ul className="space-y-2 text-sm">
                <li>• Agrega más empleados</li>
                <li>• Programa turnos semanales</li>
                <li>• Configura notificaciones</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}