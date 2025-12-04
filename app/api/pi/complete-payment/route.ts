import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid, serverPaymentId } = await req.json();

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "PI_API_KEY missing" },
        { status: 500 }
      );
    }

    if (!paymentId || !txid) {
      return NextResponse.json(
        { ok: false, error: "paymentId and txid required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://sandbox-api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({ txid, metadata: { serverPaymentId } }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, payment: data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
