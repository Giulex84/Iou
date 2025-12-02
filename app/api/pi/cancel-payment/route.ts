import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "PI_API_KEY missing" }, { status: 500 });
    }

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "paymentId required" }, { status: 400 });
    }

    const res = await fetch(`https://sandbox-api.minepi.com/v2/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, payment: data });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
