import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
  validateMasterAccessCode,
  AdminSessionPayload,
} from '@/lib/adminAuth';

const ADMIN_COOKIE_NAME = 'admin_session';

const ALLOWED_ADMIN_ROLES = ['owner', 'admin', 'super_admin', 'verifier', 'support', 'auditor'] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const cookieStore = await cookies();

    // -------------------------------------------------------------
    // 1. CHECK CURRENT ADMIN SESSION
    // -------------------------------------------------------------
    if (action === 'check') {
      const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      const user = verifyAdminSessionToken(token);

      if (user) {
        return NextResponse.json({ authenticated: true, user });
      }

      return NextResponse.json({ authenticated: false });
    }

    // -------------------------------------------------------------
    // 2. LOGOUT ADMIN
    // -------------------------------------------------------------
    if (action === 'logout') {
      cookieStore.set(ADMIN_COOKIE_NAME, '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true });
    }

    // -------------------------------------------------------------
    // 3. LOGIN VIA MASTER ACCESS CODE / PIN
    // -------------------------------------------------------------
    if (action === 'login' && body.mode === 'accessCode') {
      const { accessCode } = body;

      if (!accessCode || typeof accessCode !== 'string') {
        return NextResponse.json(
          { error: 'يرجى إدخال رمز الأمان الإداري.' },
          { status: 400 }
        );
      }

      const isValid = validateMasterAccessCode(accessCode);
      if (!isValid) {
        return NextResponse.json(
          { error: 'رمز الأمان الإداري غير صحيح. يرجى التأكد وإعادة المحاولة.' },
          { status: 401 }
        );
      }

      const sessionData: Omit<AdminSessionPayload, 'exp'> = {
        userId: 'owner-master',
        email: 'owner@store.com',
        role: 'owner',
        name: 'المهندس سيف (المالك)',
      };

      const token = createAdminSessionToken(sessionData, 7);

      cookieStore.set(ADMIN_COOKIE_NAME, token, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        user: sessionData,
      });
    }

    // -------------------------------------------------------------
    // 4. LOGIN VIA EMAIL & PASSWORD (SUPABASE STAFF ACCOUNT)
    // -------------------------------------------------------------
    if (action === 'login' && body.mode === 'credentials') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' },
          { status: 400 }
        );
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json(
          { error: 'إعدادات قاعدة البيانات Supabase غير مكتملة.' },
          { status: 500 }
        );
      }

      const authClient = createClient(supabaseUrl, supabaseAnonKey);
      const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
        email: String(email).trim(),
        password: String(password),
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.' },
          { status: 401 }
        );
      }

      const userId = authData.user.id;
      const userEmail = authData.user.email || String(email);
      let assignedRole: AdminSessionPayload['role'] = 'admin';
      let staffName = authData.user.user_metadata?.full_name || userEmail.split('@')[0];

      // Check role in user_roles table using service role (bypass RLS for accurate admin check)
      if (serviceRoleKey) {
        const adminClient = createClient(supabaseUrl, serviceRoleKey);
        const { data: roleData } = await adminClient
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();

        if (roleData && ALLOWED_ADMIN_ROLES.includes(roleData.role as any)) {
          assignedRole = roleData.role as AdminSessionPayload['role'];
        } else {
          // If this is the store owner or first configured admin, auto-assign owner
          const isConfiguredOwner =
            userEmail.toLowerCase() === 'owner@store.com' ||
            userEmail.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

          if (isConfiguredOwner) {
            assignedRole = 'owner';
            await adminClient
              .from('user_roles')
              .upsert({ user_id: userId, role: 'owner' }, { onConflict: 'user_id,role' });
          } else {
            return NextResponse.json(
              {
                error:
                  'تم تسجيل الدخول بنجاح ولكن هذا الحساب ليس لديه صلاحيات إدارية (حساب عميل عادي).',
              },
              { status: 403 }
            );
          }
        }
      }

      const sessionData: Omit<AdminSessionPayload, 'exp'> = {
        userId,
        email: userEmail,
        role: assignedRole,
        name: staffName,
      };

      const token = createAdminSessionToken(sessionData, 7);

      cookieStore.set(ADMIN_COOKIE_NAME, token, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        user: sessionData,
      });
    }

    return NextResponse.json({ error: 'إجراء غير معروف.' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin Auth Error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة طلب الدخول الإداري.' },
      { status: 500 }
    );
  }
}
