import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const sql = neon(process.env.DATABASE_URL)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Intentando login con:', credentials.email)
          
          // Buscar usuario en la base de datos
          const usuarios = await sql`
            SELECT id, email, nombre, password, rol, empresa_id 
            FROM usuarios 
            WHERE email = ${credentials.email}
          `
          
          const usuario = usuarios[0]
          
          if (!usuario) {
            console.log('❌ Usuario no encontrado:', credentials.email)
            return null
          }
          
          console.log('✅ Usuario encontrado:', usuario.nombre)
          
          // Verificar contraseña usando bcrypt
          const passwordValido = await bcrypt.compare(credentials.password, usuario.password)
          
          if (!passwordValido) {
            console.log('❌ Contraseña incorrecta para:', credentials.email)
            return null
          }
          
          console.log('✅ Login exitoso para:', usuario.nombre)
          
          // Retornar usuario sin la contraseña
          return {
            id: usuario.id,
            email: usuario.email,
            name: usuario.nombre,
            role: usuario.rol,
            empresaId: usuario.empresa_id
          }
          
        } catch (error) {
          console.error('❌ Error en authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.empresaId = user.empresaId
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.empresaId = token.empresaId
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Esto mostrará logs detallados
}

export default NextAuth(authOptions)