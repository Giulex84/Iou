// lib/ious.ts
import { supabase } from "./supabase";
import type { IOU } from "./types";

export type NewIouPayload = Pick<
  IOU,
  | "description"
  | "amount"
  | "other_party"
  | "direction"
  | "created_by_uid"
  | "is_settled"
>;

// ------------------------------
// CREA IOU
// ------------------------------
export async function addIou(iou: NewIouPayload): Promise<IOU> {
  const payload: Omit<IOU, "id" | "created_at"> = {
    description: iou.description,
    amount: iou.amount,
    other_party: iou.other_party,
    direction: iou.direction,
    created_by_uid: iou.created_by_uid ?? null,
    is_settled: iou.is_settled ?? false,
  };

  const data = await insertIou(payload);

  return normalizeRow(data);
}

// ------------------------------
// LEGGI TUTTI GLI IOU
// ------------------------------
export async function getIous(): Promise<IOU[]> {
  const { data, error } = await supabase
    .from("ious")
    .select("id, description, amount, other_party, direction, created_by_uid, is_settled, created_at")
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
  const data = await updateIouRow(id, updates);

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
    other_party: row?.other_party ?? "",
    direction: row?.direction === "i_am_owed" ? "i_am_owed" : "i_owe",
    created_by_uid: row?.created_by_uid ?? null,
    is_settled: Boolean(row?.is_settled),
  } as IOU;
}

async function insertIou(payload: Omit<IOU, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("ious")
    .insert(payload)
    .select("id, description, amount, other_party, direction, created_by_uid, is_settled, created_at")
    .single();

  if (error) {
    console.error("Supabase error (addIou):", error.message);
    throw error;
  }

  return data;
}

async function updateIouRow(
  id: string,
  updates: Partial<Omit<IOU, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("ious")
    .update(updates)
    .eq("id", id)
    .select("id, description, amount, other_party, direction, created_by_uid, is_settled, created_at")
    .single();

  if (error) {
    console.error("Supabase error (updateIou):", error.message);
    throw error;
  }

  return data;
}

// Compatibility alias for future imports
export const createIou = addIou;
