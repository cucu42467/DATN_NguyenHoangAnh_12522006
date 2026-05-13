import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';

export function proxy(request: NextRequest) {
  // Protect /user/* routes (except API)
  if (request.nextUrl.pathname.startsWith('/user') && !request.nextUrl.pathname.startsWith('/user/api')) {
    // Check auth cookie or header proxy (since localStorage client-only)
    // For SSR, use httpOnly cookie set on login (future improvement)
    // Temp: allow all (client guard sufficient), or check custom header
    const token = request.cookies.get('authToken')?.value ||
                  request.headers.get('x-auth-token');

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/DangNhap';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*']
};

