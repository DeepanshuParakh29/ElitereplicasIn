import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader, ADMIN_TOKEN_COOKIE, USER_TOKEN_COOKIE } from './lib/auth/jwt';

// Extract token from request (either from cookies or authorization header)
function extractTokenFromRequest(request: NextRequest): string | null {
  // First check cookies (preferred method)
  const adminToken = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (adminToken) return adminToken;
  
  const userToken = request.cookies.get(USER_TOKEN_COOKIE)?.value;
  if (userToken) return userToken;
  
  // Then check authorization header as fallback
  const authHeader = request.headers.get('authorization');
  return extractTokenFromHeader(authHeader || undefined);
}

// Admin routes that require authentication
const PROTECTED_ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/users',
  '/admin/admin-users',
  '/admin/orders',
  '/admin/analytics',
  '/admin/marketing',
  '/admin/settings',
];

// User routes that require authentication
const PROTECTED_USER_ROUTES = [
  '/user/profile',
  '/user/orders',
  '/user/wishlist',
  '/user/addresses',
  '/user/payment-methods',
  '/checkout',
];

// Check if the route is an admin route that requires protection
function isProtectedAdminRoute(pathname: string): boolean {
  return PROTECTED_ADMIN_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Check if the route is a user route that requires protection
function isProtectedUserRoute(pathname: string): boolean {
  return PROTECTED_USER_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // 1. Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }
  
  // 2. Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Enhanced CSP - can be expanded based on your needs
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
  );
  
  // 3. Handle protected admin routes
  if (isProtectedAdminRoute(pathname)) {
    // Extract token from request (either from Authorization header or cookies)
    const token = extractTokenFromRequest(request);
    
    if (!token) {
      // No token found, redirect to login
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'superadmin')) {
      // Invalid token or insufficient permissions
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // 4. Handle protected user routes
  if (isProtectedUserRoute(pathname)) {
    // Extract token from request (either from Authorization header or cookies)
    const token = extractTokenFromRequest(request);
    
    if (!token) {
      // No token found, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      // Invalid token
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // 5. Handle category route standardization (as per routing memory)
  if (pathname.startsWith('/category/')) {
    const slug = pathname.split('/category/')[1];
    return NextResponse.redirect(new URL(`/categories/${slug}`, request.url));
  }
  
  // 6. Handle user profile route standardization (as per routing memory)
  if (pathname === '/profile') {
    return NextResponse.redirect(new URL('/user/profile', request.url));
  }
  
  // 7. Prevent access to verify-email and reset-password without tokens
  if (pathname === '/verify-email' && !request.nextUrl.searchParams.get('token')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (pathname === '/reset-password' && !request.nextUrl.searchParams.get('token')) {
    return NextResponse.redirect(new URL('/reset-password/request', request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
