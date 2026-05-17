import { neon } from '@neondatabase/serverless'

// Verificar que la variable existe
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no está definida en .env.local')
}

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    console.log('API empleados - Método:', req.method)
    
    if (req.method === 'GET') {
      console.log('Intentando conectar a Neon...')
      const empleados = await sql`
        SELECT * FROM empleados ORDER BY id
      `
      console.log('Empleados encontrados:', empleados.length)
      return res.status(200).json(empleados)
    }
    
    if (req.method === 'POST') {
      const { nombre, email, telefono, rol } = req.body
      
      if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' })
      }
      
      const nuevoEmpleado = await sql`
        INSERT INTO empleados (nombre, email, telefono, rol)
        VALUES (${nombre}, ${email}, ${telefono || null}, ${rol || 'Empleado'})
        RETURNING *
      `
      return res.status(201).json(nuevoEmpleado[0])
    }
    
    if (req.method === 'PUT') {
      const { id, nombre, email, telefono, rol } = req.body
      
      if (!id || !nombre || !email) {
        return res.status(400).json({ error: 'ID, nombre y email son requeridos' })
      }
      
      const empleadoActualizado = await sql`
        UPDATE empleados
        SET nombre = ${nombre}, 
            email = ${email}, 
            telefono = ${telefono || null}, 
            rol = ${rol || 'Empleado'}
        WHERE id = ${id}
        RETURNING *
      `
      
      if (empleadoActualizado.length === 0) {
        return res.status(404).json({ error: 'Empleado no encontrado' })
      }
      
      return res.status(200).json(empleadoActualizado[0])
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' })
      }
      
      const resultado = await sql`
        DELETE FROM empleados WHERE id = ${id} RETURNING id
      `
      
      if (resultado.length === 0) {
        return res.status(404).json({ error: 'Empleado no encontrado' })
      }
      
      return res.status(200).json({ message: 'Empleado eliminado correctamente' })
    }
    
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Método ${req.method} no permitido` })
    
  } catch (error) {
    console.error('Error detallado en API de empleados:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}