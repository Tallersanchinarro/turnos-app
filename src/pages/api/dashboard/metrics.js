import { neon } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    // Contar empleados de la misma empresa
    const empleados = await sql`
      SELECT COUNT(*) as total FROM usuarios 
      WHERE empresa_id = ${session.user.empresaId} AND activo = true
    `
    
    // Turnos de hoy
    const turnosHoy = await sql`
      SELECT COUNT(*) as total FROM turnos 
      WHERE fecha = CURRENT_DATE
    `
    
    // Turnos de la semana
    const turnosSemana = await sql`
      SELECT COUNT(*) as total FROM turnos 
      WHERE fecha >= CURRENT_DATE 
      AND fecha <= CURRENT_DATE + INTERVAL '7 days'
    `
    
    res.status(200).json({
      empleados: parseInt(empleados[0]?.total || 0),
      turnosHoy: parseInt(turnosHoy[0]?.total || 0),
      turnosSemana: parseInt(turnosSemana[0]?.total || 0),
      ausencias: 0
    })
    
  } catch (error) {
    console.error('Error en métricas:', error)
    res.status(500).json({ error: 'Error al obtener métricas' })
  }
}