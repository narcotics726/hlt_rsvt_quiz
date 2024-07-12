import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get('hlt-rsvt.session-token');

    const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';

    const response = NextResponse.next();

    if (!request.cookies.get('hlt-rsvt.session-token')) {
        const sessionToken = uuidv4();
        response.cookies.set('hlt-rsvt.session-token', sessionToken);
    }

    if (/\/internal\/.*/.test(request.nextUrl.pathname) && request.nextUrl.pathname !== '/internal/login') {
        // #TODO: do JWT verification
        const isTokenValid = true;
        if (!isTokenValid) {
            return NextResponse.redirect(new URL('/internal/login', request.url));
        }
    }

    return response
}
