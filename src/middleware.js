import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Configuración de rate limiting simple
const rateLimit = new Map()

function getRateLimit(ip) {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minuto
  const maxRequests = 30 // 30 peticiones por minuto
  
  const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
  } else {
    record.count++
  }
  
  rateLimit.set(ip, record)
  
  return {
    isLimited: record.count > maxRequests,
    remaining: Math.max(0, maxRequests - record.count)
  }
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting para APIs (excepto auth)
    if (path.startsWith('/api') && !path.startsWith('/api/auth')) {
      const { isLimited, remaining } = getRateLimit(ip)
      
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Remaining', remaining)
      
      if (isLimited) {
        return NextResponse.json(
          { error: 'Demasiadas peticiones. Espera un momento.' },
          { status: 429 }
        )
      }
      
      return response
    }
    
    // Proteger rutas de admin
    if (path === '/empleados' && token?.rol !== 'admin' && token?.rol !== 'supervisor') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
    }
  }
)

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/empleados/:path*',
    '/turnos/:path*',
    '/api/:path*',
    '/((?!login|api/auth).*)'
  ]
}