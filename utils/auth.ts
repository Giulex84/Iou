// utils/auth.ts
import { supabase } from "@/lib/supabase";

export interface PiUserProfile {
  uid: string;
  username: string;
  accessToken?: string;
}

/**
 * Sincronizza l'utente Pi con la tabella `profiles` di Supabase.
 * Se il profilo esiste viene aggiornato, altrimenti viene creato.
 */
export async function syncPiProfile(piUser: PiUserProfile) {
  const { uid, username, accessToken } = piUser;
  if (!uid) throw new Error("L'utente Pi non ha un identificativo valido.");

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: uid,
        username,
        access_token: accessToken ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
