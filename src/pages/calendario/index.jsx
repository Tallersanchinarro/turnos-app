import Header from '../../components/Header'
import Calendario from '../../components/Calendario'

export default function CalendarioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Calendario />
        </div>
      </div>
    </div>
  )
}