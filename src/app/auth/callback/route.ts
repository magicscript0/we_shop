import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/auth/welcome-gift';

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Redirect to welcome gift surprise after OAuth callback
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch {
      // Graceful fallback for local development or disconnected state
    }
  }

  // Return the user to login with error notice if exchange failed
  return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', requestUrl.origin));
}
