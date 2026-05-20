import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const resultado = {
    paso1_verificar_variable: {
      existe: !!process.env.DATABASE_URL,
      longitud: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      preview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'no existe'
    }
  }

  // Si no existe la variable, terminar aquí
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'DATABASE_URL no está configurada en Vercel',
      ...resultado
    })
  }

  try {
    // Paso 2: Intentar conectar
    const sql = neon(process.env.DATABASE_URL)
    resultado.paso2_conexion = { estado: 'intentando' }
    
    const now = await sql`SELECT NOW() as tiempo`
    resultado.paso2_conexion = { 
      estado: 'exitoso',
      tiempo: now[0].tiempo 
    }

    // Paso 3: Verificar tablas
    resultado.paso3_tablas = {}
    
    const tablas = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    resultado.paso3_tablas.lista = tablas.map(t => t.table_name)
    resultado.paso3_tablas.tiene_empleados = tablas.some(t => t.table_name === 'empleados')
    resultado.paso3_tablas.tiene_turnos = tablas.some(t => t.table_name === 'turnos')

    // Paso 4: Contar registros si existen
    if (resultado.paso3_tablas.tiene_empleados) {
      const empleados = await sql`SELECT COUNT(*) as total FROM empleados`
      resultado.paso3_tablas.total_empleados = parseInt(empleados[0].total)
    }

    if (resultado.paso3_tablas.tiene_turnos) {
      const turnos = await sql`SELECT COUNT(*) as total FROM turnos`
      resultado.paso3_tablas.total_turnos = parseInt(turnos[0].total)
    }

    // Éxito total
    resultado.exito = true
    resultado.mensaje = 'Base de datos funcionando correctamente'
    
    return res.status(200).json(resultado)

  } catch (error) {
    resultado.error = {
      mensaje: error.message,
      codigo: error.code,
      detalle: error.detail
    }
    resultado.exito = false
    
    return res.status(500).json(resultado)
  }
}