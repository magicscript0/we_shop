import { NextResponse } from 'next/server';
import { getSecurePaymentAccountForOrder } from '@/lib/services/paymentAccounts.server';

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const { searchParams } = new URL(request.url);
    const methodKey = searchParams.get('methodKey') || 'vodafone_cash';
    const status = searchParams.get('status') || 'awaiting_payment';

    // Retrieve destination account with launch guard checks
    const result = getSecurePaymentAccountForOrder(status, methodKey);

    if (!result.success || !result.account) {
      return NextResponse.json(
        { error: result.errorAr || 'تعذر جلب بيانات الحساب المعتمد.' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        methodKey: result.account.method_key,
        accountValue: result.account.account_value,
        accountHolderName: result.account.account_holder_name,
        instructionsMd: result.account.instructions_md,
        isVerified: result.account.is_verified,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات التحويل.' },
      { status: 500 }
    );
  }
}
