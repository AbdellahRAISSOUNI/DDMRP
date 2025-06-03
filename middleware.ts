import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    const session = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
    });
    
    // If no session or not an admin, redirect to login
    if (!session || session.role !== 'admin') {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 