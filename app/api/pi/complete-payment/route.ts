import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid, serverPaymentId } = await req.json();

    if (!paymentId || !txid) {
      return NextResponse.json(
        { ok: false, error: "paymentId and txid required" },
        { status: 400 }
      );
    }

    console.log("COMPLETED:", { paymentId, txid, serverPaymentId });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
