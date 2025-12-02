// lib/ious.ts
import { supabase } from "./supabase";
import type { IOU } from "./types";

// ------------------------------
// CREA IOU
// ------------------------------
export async function addIou(iou: Omit<IOU, "id">): Promise<IOU> {
  const { data, error } = await supabase
    .from("ious")
    .insert(iou)
    .select("*")
    .single();

  if (error) {
    console.error("Errore Supabase (addIou):", error.message);
    throw error;
  }

  // amount potrebbe tornare come stringa -> forziamo number
  return {
    ...data,
    amount: Number(data.amount),
  } as IOU;
}

// ------------------------------
// LEGGI TUTTI GLI IOU
// ------------------------------
export async function getIous(): Promise<IOU[]> {
  const { data, error } = await supabase
    .from("ious")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Errore Supabase (getIous):", error.message);
    throw error;
  }

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  })) as IOU[];
}

// ------------------------------
// AGGIORNA UN IOU
// ------------------------------
export async function updateIou(
  id: string,
  updates: Partial<IOU>
): Promise<IOU> {
  const { data, error } = await supabase
    .from("ious")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Errore Supabase (updateIou):", error.message);
    throw error;
  }

  return {
    ...data,
    amount: Number(data.amount),
  } as IOU;
}

// ------------------------------
// ELIMINA UN IOU
// ------------------------------
export async function deleteIou(id: string): Promise<boolean> {
  const { error } = await supabase.from("ious").delete().eq("id", id);

  if (error) {
    console.error("Errore Supabase (deleteIou):", error.message);
    throw error;
  }

  return true;
}
