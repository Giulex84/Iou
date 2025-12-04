import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentId } = (await req.json()) as { paymentId?: string };

  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
  }

  try {
    console.warn("Pi payment cancelled from client", paymentId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error recording Pi payment cancellation", error);
    return NextResponse.json(
      { error: "Failed to record cancellation" },
      { status: 500 }
    );
  }
}
