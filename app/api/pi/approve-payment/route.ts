import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, serverPaymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { ok: false, error: "paymentId required" },
        { status: 400 }
      );
    }

    // Qui potresti salvare su DB (opzionale)
    console.log("APPROVED:", { paymentId, serverPaymentId });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
