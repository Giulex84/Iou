"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { IOU } from "@/lib/types";
import {
  addIou as addIouToDb,
  getIous as getIousFromDb,
  updateIou as updateIouInDb,
  deleteIou as deleteIouFromDb,
} from "@/lib/ious";

type IOUContextType = {
  ious: IOU[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addIou: (iou: Omit<IOU, "id">) => Promise<void>;
  togglePaid: (id: string, paid: boolean) => Promise<void>;
  removeIou: (id: string) => Promise<void>;
};

const IOUContext = createContext<IOUContextType | undefined>(undefined);

// Hook da usare nei componenti (Add page, History, IouCard ecc.)
export function useIOUs(): IOUContextType {
  const ctx = useContext(IOUContext);
  if (!ctx) {
    throw new Error("useIOUs deve essere usato dentro IOUProvider");
  }
  return ctx;
}

export default function IOUProvider({ children }: { children: ReactNode }) {
  const [ious, setIous] = useState<IOU[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica inizialmente tutti gli IOU
  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIousFromDb();
      setIous(data);
    } catch (err: any) {
      setError(err.message ?? "Errore caricamento IOUs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addIou = async (iou: Omit<IOU, "id">) => {
    try {
      setError(null);
      const saved = await addIouToDb(iou);
      setIous((prev) => [saved, ...prev]);
    } catch (err: any) {
      setError(err.message ?? "Errore creazione IOU");
      throw err;
    }
  };

  const togglePaid = async (id: string, paid: boolean) => {
    try {
      setError(null);
      const updated = await updateIouInDb(id, { paid });
      setIous((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err: any) {
      setError(err.message ?? "Errore aggiornamento IOU");
      throw err;
    }
  };

  const removeIou = async (id: string) => {
    try {
      setError(null);
      await deleteIouFromDb(id);
      setIous((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message ?? "Errore eliminazione IOU");
      throw err;
    }
  };

  return (
    <IOUContext.Provider
      value={{ ious, loading, error, refresh, addIou, togglePaid, removeIou }}
    >
      {children}
    </IOUContext.Provider>
  );
}
