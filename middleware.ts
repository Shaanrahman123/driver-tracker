import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    let sessionPayload = null;
    if (session) {
        sessionPayload = await decrypt(session);
    }

    const path = request.nextUrl.pathname;
    const isAuthPage = path.startsWith('/login') || path.startsWith('/signup');
    const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/admin');
    const isAdminPath = path.startsWith('/admin');

    if (isProtectedPath && !sessionPayload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthPage && sessionPayload) {
        if (sessionPayload.user.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isAdminPath && sessionPayload?.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
