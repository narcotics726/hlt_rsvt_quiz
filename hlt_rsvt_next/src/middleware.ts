import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get('hlt-rsvt.session-token');
    const response = NextResponse.next();

    console.log(`cookie: ${cookie}`);
    if (!request.cookies.get('hlt-rsvt.session-token')) {
        const sessionToken = uuidv4();
        response.cookies.set('hlt-rsvt.session-token', sessionToken);
    }

    return response
}
