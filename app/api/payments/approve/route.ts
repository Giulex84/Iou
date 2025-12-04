import { NextResponse } from "next/server";
import { approvePiPayment } from "@/lib/piApi";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { paymentId } = (await req.json()) as { paymentId?: string };

  if (!paymentId) {
    return NextResponse.json(
      { error: "Missing paymentId" },
      { status: 400 }
    );
  }

  try {
    await approvePiPayment(paymentId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error approving Pi payment", error);
    return NextResponse.json(
      { error: "Failed to approve payment" },
      { status: 500 }
    );
  }
}
