import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no está definida en .env.local')
}

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    console.log('API turnos - Método:', req.method)
    
    if (req.method === 'GET') {
      console.log('Intentando obtener turnos...')
      const turnos = await sql`
        SELECT * FROM turnos ORDER BY fecha DESC, hora_inicio ASC
      `
      console.log('Turnos encontrados:', turnos.length)
      return res.status(200).json(turnos)
    }
    
    if (req.method === 'POST') {
      const { empleado, fecha, horaInicio, horaFin, tipo } = req.body
      
      if (!empleado || !fecha || !horaInicio || !horaFin) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' })
      }
      
      const nuevoTurno = await sql`
        INSERT INTO turnos (empleado, fecha, hora_inicio, hora_fin, tipo)
        VALUES (${empleado}, ${fecha}, ${horaInicio}, ${horaFin}, ${tipo || 'Mañana'})
        RETURNING *
      `
      return res.status(201).json(nuevoTurno[0])
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' })
      }
      
      const resultado = await sql`
        DELETE FROM turnos WHERE id = ${id} RETURNING id
      `
      
      if (resultado.length === 0) {
        return res.status(404).json({ error: 'Turno no encontrado' })
      }
      
      return res.status(200).json({ message: 'Turno eliminado correctamente' })
    }
    
    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    return res.status(405).json({ error: `Método ${req.method} no permitido` })
    
  } catch (error) {
    console.error('Error detallado en API de turnos:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}