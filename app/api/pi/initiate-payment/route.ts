import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, memo, metadata } = await req.json();

    // Generate a server-side identifier so the flow can be reconciled later
    const serverPaymentId = "SP_" + Math.random().toString(36).substring(2, 12);

    const normalizedAmount = Number(amount) || 0;
    if (normalizedAmount <= 0) {
      return NextResponse.json(
        { ok: false, error: "amount must be greater than zero" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      serverPaymentId,
      amount: normalizedAmount,
      memo,
      metadata,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
