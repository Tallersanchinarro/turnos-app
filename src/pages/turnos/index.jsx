import Header from '../../components/Header'
import Turnero from '../../components/Turnero'

export default function TurnosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Turnero />
        </div>
      </div>
    </div>
  )
}