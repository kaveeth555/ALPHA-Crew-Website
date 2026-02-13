import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Define protected routes
    const isProtected = pathname.startsWith('/admin') ||
        pathname.startsWith('/api/upload') ||
        pathname.startsWith('/api/seed');

    // Protect API methods (POST/PUT/DELETE) on /api/photos
    const isProtectedApi = pathname.startsWith('/api/photos') &&
        ['POST', 'PUT', 'DELETE'].includes(req.method);

    if (isProtected || isProtectedApi) {
        const token = req.cookies.get('admin_token')?.value;
        const verifiedToken = token && (await verifyToken(token));

        if (!verifiedToken) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/upload/:path*',
        '/api/seed/:path*',
        '/api/photos/:path*',
    ],
};
