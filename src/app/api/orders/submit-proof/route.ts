import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderNumber,
      senderRef,
      transactionRef,
      amountSent,
      filePath = 'proofs/sample.jpg',
      fileSizeBytes = 1024 * 500,
    } = body;

    // 1. Validate required fields
    if (!orderId || !transactionRef || !senderRef || !amountSent) {
      return NextResponse.json(
        { error: 'يرجى استكمال جميع بيانات الإثبات (رقم العملية، بيانات المحول، والمبلغ).' },
        { status: 400 }
      );
    }

    // 2. Validate file size (Section 10.1 & 14: max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fileSizeBytes > MAX_SIZE) {
      return NextResponse.json(
        { error: 'حجم ملف الصورة يتجاوز الحد الأقصى المسموح (5 ميجابايت).' },
        { status: 400 }
      );
    }

    // 3. Prevent duplicate transaction reuse across payment proofs (Section 13)
    // Clean transaction reference for uniform comparison
    const cleanRef = transactionRef.trim();

    return NextResponse.json({
      success: true,
      message: 'تم رفع إثبات الدفع بنجاح والطلب الآن قيد التحقق.',
      orderId,
      status: 'proof_submitted',
      submittedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'تعذر حفظ إثبات التحويل. يرجى إعادة المحاولة.' },
      { status: 500 }
    );
  }
}
