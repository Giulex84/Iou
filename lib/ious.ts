// lib/ious.ts
import { supabase } from "./supabase";
import type { IOU } from "./types";

// ------------------------------
// CREA IOU
// ------------------------------
export async function addIou(
  iou: Omit<IOU, "id" | "created_at">
): Promise<IOU> {
  const payload = {
    description: iou.description,
    amount: iou.amount,
    involved_party: iou.involved_party,
    is_settled: iou.is_settled ?? false,
    transaction_type: iou.transaction_type,
  } satisfies Omit<IOU, "id" | "created_at">;

  const { data, error } = await supabase
    .from("ious")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase error (addIou):", error.message);
    throw error;
  }

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
  const { data, error } = await supabase
    .from("ious")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase error (updateIou):", error.message);
    throw error;
  }

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
    amount: Number(row.amount),
  } as IOU;
}
