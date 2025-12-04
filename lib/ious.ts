// lib/ious.ts
import { supabase } from "./supabase";
import type { IOU } from "./types";

export type NewIouPayload = Pick<
  IOU,
  "description" | "amount" | "involved_party" | "transaction_type" | "is_settled"
>;

// ------------------------------
// CREA IOU
// ------------------------------
export async function addIou(iou: NewIouPayload): Promise<IOU> {
  const payload = {
    description: iou.description,
    amount: iou.amount,
    involved_party: iou.involved_party,
    is_settled: iou.is_settled ?? false,
    transaction_type: iou.transaction_type,
  } satisfies Omit<IOU, "id" | "created_at">;

  const data = await insertWithDescriptionFallback(payload);

  return normalizeRow(data);
}

// ------------------------------
// LEGGI TUTTI GLI IOU
// ------------------------------
export async function getIous(): Promise<IOU[]> {
  const { data, error } = await supabase
    .from("ious")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error (getIous):", error.message);
    throw error;
  }

  return (data ?? []).map(normalizeRow);
}

// ------------------------------
// AGGIORNA UN IOU
// ------------------------------
export async function updateIou(
  id: string,
  updates: Partial<Omit<IOU, "id" | "created_at">>
): Promise<IOU> {
  const data = await updateWithDescriptionFallback(id, updates);

  return normalizeRow(data);
}

// ------------------------------
// ELIMINA UN IOU
// ------------------------------
export async function deleteIou(id: string): Promise<boolean> {
  const { error } = await supabase.from("ious").delete().eq("id", id);

  if (error) {
    console.error("Supabase error (deleteIou):", error.message);
    throw error;
  }

  return true;
}

function normalizeRow(row: any): IOU {
  return {
    ...row,
    description: row?.description ?? "",
    amount: Number(row.amount),
  } as IOU;
}

function isMissingDescriptionColumn(error: any) {
  return (
    typeof error?.message === "string" &&
    error.message.toLowerCase().includes("description") &&
    error.message.toLowerCase().includes("schema cache")
  );
}

async function insertWithDescriptionFallback(payload: any) {
  const { data, error } = await supabase
    .from("ious")
    .insert(payload)
    .select("*")
    .single();

  if (!error) return data;

  if (isMissingDescriptionColumn(error)) {
    const fallbackPayload = { ...payload };
    delete fallbackPayload.description;

    const retry = await supabase
      .from("ious")
      .insert(fallbackPayload)
      .select("*")
      .single();

    if (!retry.error) return retry.data;
    console.error("Supabase error after fallback (addIou):", retry.error.message);
    throw retry.error;
  }

  console.error("Supabase error (addIou):", error.message);
  throw error;
}

async function updateWithDescriptionFallback(id: string, updates: any) {
  const { data, error } = await supabase
    .from("ious")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (!error) return data;

  if (isMissingDescriptionColumn(error)) {
    const fallbackUpdates = { ...updates };
    delete fallbackUpdates.description;

    const retry = await supabase
      .from("ious")
      .update(fallbackUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (!retry.error) return retry.data;
    console.error("Supabase error after fallback (updateIou):", retry.error.message);
    throw retry.error;
  }

  console.error("Supabase error (updateIou):", error.message);
  throw error;
}
