// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Se não tiver token, redireciona para login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Chamada ao seu backend para verificar o token
        const res = await fetch(`http://localhost:3001/api/v1/auth/verificar`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const userData = await res.json()

        // Você pode opcionalmente colocar dados no header ou cookies aqui
        const response = NextResponse.next()
        response.headers.set('x-user-id', userData.id)
        response.headers.set('x-user-name', userData.nome)
        return response
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Define as rotas que devem passar pelo middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
