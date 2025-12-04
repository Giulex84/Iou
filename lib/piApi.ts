const PI_API_BASE = "https://api.minepi.com/v2";
const PI_API_KEY = process.env.PI_TESTNET_API_KEY ?? process.env.PI_API_KEY;

const serverHeaders = {
  Authorization: `Key ${PI_API_KEY ?? ""}`,
  "Content-Type": "application/json",
};

async function handleResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload?.error === "string" ? payload.error : response.statusText;
    throw new Error(message || "Pi API request failed");
  }
  return payload;
}

export async function approvePiPayment(paymentId: string) {
  if (!PI_API_KEY)
    throw new Error("Missing PI_TESTNET_API_KEY environment variable");
  const url = `${PI_API_BASE}/payments/${paymentId}/approve`;
  const res = await fetch(url, { method: "POST", headers: serverHeaders });
  return handleResponse(res);
}

export async function completePiPayment(paymentId: string, txid: string) {
  if (!PI_API_KEY)
    throw new Error("Missing PI_TESTNET_API_KEY environment variable");
  const url = `${PI_API_BASE}/payments/${paymentId}/complete`;
  const res = await fetch(url, { method: "POST", headers: serverHeaders, body: JSON.stringify({ txid }) });
  return handleResponse(res);
}
