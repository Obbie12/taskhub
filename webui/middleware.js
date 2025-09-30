import { NextResponse } from 'next/server';

export function middleware(request) {
    // Check if the user is authenticated
    // Since we're using localStorage which isn't accessible in middleware,
    // we'll rely on client-side protection
    // For server-side protection, we'd need to use cookies or sessions
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
