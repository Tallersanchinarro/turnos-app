import { useState } from 'react'
import Header from '../components/Header'
import Turnero from '../components/Turnero'
import Empleados from '../components/Empleados'
import Calendario from '../components/Calendario'

export default function Home() {
  const [activeTab, setActiveTab] = useState('turnos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navegación */}
        <div className="flex gap-2 mb-8 bg-white rounded-lg p-1 shadow-md max-w-md mx-auto">
          {['turnos', 'empleados', 'calendario'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'turnos' && '📋 Turnos'}
              {tab === 'empleados' && '👥 Empleados'}
              {tab === 'calendario' && '📅 Calendario'}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {activeTab === 'turnos' && <Turnero />}
          {activeTab === 'empleados' && <Empleados />}
          {activeTab === 'calendario' && <Calendario />}
        </div>
      </div>
    </div>
  )
}