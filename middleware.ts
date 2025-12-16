import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/admin-login'];
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );

  // If trying to access protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login/register while already logged in
  if (isPublicPath && token) {
    // Redirect based on role
    if (userRole === 'superadmin') {
      return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
    } else if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based route protection
  if (token && !isPublicPath) {
    // Superadmin routes
    if (pathname.startsWith('/superadmin') && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Manager routes
    if (pathname.startsWith('/manager') && !['superadmin', 'manager'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Support staff routes
    if (pathname.startsWith('/support') && !['superadmin', 'manager', 'support'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
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