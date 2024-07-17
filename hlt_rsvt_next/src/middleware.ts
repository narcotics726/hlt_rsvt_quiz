import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ApiClient } from './lib/api_client';


async function getUserInfoFromCookie() {
    const token = cookies().get('hlt-rsvt.session-token')?.value;
    const info = cookies().get('hlt-rsvt.user-info')?.value;
    if (!info) {
        return ApiClient.getClient().getUserInfo(token);
    }

    const userInfo = JSON.parse(info);
    console.log(`[getCustomerInfo] userInfo: ${JSON.stringify(userInfo)}`);
    return userInfo;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('hlt-rsvt.session-token')?.value;

    let info = await getUserInfoFromCookie();
    console.log(`[middleware] info: ${JSON.stringify(info)}`);

    const response = NextResponse.next();

    if (
        /\/internal\/.*/.test(request.nextUrl.pathname) &&
        request.nextUrl.pathname !== '/internal/login'
    ) {
        console.log(`[middleware] redirect from ${request.nextUrl.pathname}`);
        if (info?.role !== 'employee') {
            return NextResponse.redirect(
                new URL('/internal/login', request.url)
            );
        }
    } else if (
        /\/reservations\/.*/.test(request.nextUrl.pathname) &&
        request.nextUrl.pathname !== '/reservations/login'
    ) {
        console.log(`[middleware] redirect from ${request.nextUrl.pathname}`);
        if (info?.role !== 'customer') {
            return NextResponse.redirect(
                new URL('/reservations/login', request.url)
            );
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
