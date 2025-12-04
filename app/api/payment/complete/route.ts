import { NextResponse } from "next/server";

import { completePiPayment } from "@/lib/piApi";

export async function POST(req: Request) {
  const { paymentId, txid } = (await req.json()) as {
    paymentId?: string;
    txid?: string;
  };

  if (!paymentId || !txid) {
    return NextResponse.json(
      { error: "Missing paymentId or txid" },
      { status: 400 }
    );
  }

  try {
    await completePiPayment(paymentId, txid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error completing Pi payment", error);
    return NextResponse.json(
      { error: "Failed to complete payment" },
      { status: 500 }
    );
  }
}
