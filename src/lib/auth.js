import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const sql = neon(process.env.DATABASE_URL)

export async function verificarCredenciales(email, password, ip, userAgent) {
  try {
    const usuarios = await sql`
      SELECT u.*, e.nombre as empresa_nombre 
      FROM usuarios u
      LEFT JOIN empresas e ON u.empresa_id = e.id
      WHERE u.email = ${email} AND u.activo = true
    `
    
    const usuario = usuarios[0]
    
    if (!usuario) {
      // Registrar intento fallido
      await sql`
        INSERT INTO login_logs (email, ip, user_agent, exito)
        VALUES (${email}, ${ip}, ${userAgent}, false)
      `
      return null
    }
    
    const passwordValido = await bcrypt.compare(password, usuario.password)
    
    if (!passwordValido) {
      await sql`
        INSERT INTO login_logs (usuario_id, email, ip, user_agent, exito)
        VALUES (${usuario.id}, ${email}, ${ip}, ${userAgent}, false)
      `
      return null
    }
    
    // Registrar login exitoso
    await sql`
      INSERT INTO login_logs (usuario_id, email, ip, user_agent, exito)
      VALUES (${usuario.id}, ${email}, ${ip}, ${userAgent}, true)
    `
    
    // Actualizar último login
    await sql`
      UPDATE usuarios SET ultimo_login = NOW()
      WHERE id = ${usuario.id}
    `
    
    // Devolver usuario sin password
    const { password: _, ...usuarioSinPassword } = usuario
    return usuarioSinPassword
    
  } catch (error) {
    console.error('Error en autenticación:', error)
    return null
  }
}

export async function obtenerUsuarioPorId(id) {
  try {
    const usuarios = await sql`
      SELECT u.id, u.email, u.nombre, u.rol, u.activo, u.telefono, 
             u.empresa_id, u.ultimo_login, u.created_at,
             e.nombre as empresa_nombre
      FROM usuarios u
      LEFT JOIN empresas e ON u.empresa_id = e.id
      WHERE u.id = ${id}
    `
    return usuarios[0] || null
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return null
  }
}