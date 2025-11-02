import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // First apply Supabase session handling
  let response = await updateSession(request);
  
  // Handle locale from cookie or Accept-Language header
  const pathname = request.nextUrl.pathname;
  
  // Skip locale handling for API routes, static files, and merchant routes
  const shouldSkipLocale = 
    pathname.startsWith('/api') || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    // Check if it's a merchant route (exclude known public pages)
    (pathname !== '/' && !pathname.startsWith('/home') && !pathname.startsWith('/about') && 
     !pathname.startsWith('/contact') && !pathname.startsWith('/faq') && 
     !pathname.startsWith('/privacy') && !pathname.startsWith('/terms'));
  
  if (shouldSkipLocale) {
    return response;
  }
  
  // Get locale from cookie or header
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const acceptLanguage = request.headers.get('accept-language');
  
  // Determine locale (default to 'ro')
  let locale = 'ro';
  if (localeCookie && ['ro', 'en'].includes(localeCookie)) {
    locale = localeCookie;
  } else if (acceptLanguage) {
    // Simple language detection from Accept-Language header
    if (acceptLanguage.toLowerCase().includes('en')) {
      locale = 'en';
    }
  }
  
  // Ensure response exists and set/update locale cookie
  if (!response) {
    response = NextResponse.next();
  }
  
  // Always set the locale cookie to ensure it's up to date
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
