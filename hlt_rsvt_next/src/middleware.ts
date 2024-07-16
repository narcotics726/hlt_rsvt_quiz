import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get('hlt-rsvt.session-token');

    const token =
        request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';

    const response = NextResponse.next();

    if (!cookie) {
        const sessionToken = uuidv4();
        response.cookies.set('hlt-rsvt.session-token', sessionToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });
    }

    if (
        /\/internal\/.*/.test(request.nextUrl.pathname) &&
        request.nextUrl.pathname !== '/internal/login'
    ) {
        // #TODO: do JWT verification
        const isTokenValid = true;
        if (!isTokenValid) {
            return NextResponse.redirect(
                new URL('/internal/login', request.url)
            );
        }
    }

    return response;
}
