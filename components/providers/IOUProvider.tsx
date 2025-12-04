"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { IOU } from "@/lib/types";
import type { NewIouPayload } from "@/lib/ious";
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
  addIou: (iou: NewIouPayload) => Promise<void>;
  setSettlement: (id: string, isSettled: boolean) => Promise<void>;
  removeIou: (id: string) => Promise<void>;
};

const IOUContext = createContext<IOUContextType | undefined>(undefined);

export function useIOUs(): IOUContextType {
  const ctx = useContext(IOUContext);
  if (!ctx) {
    throw new Error("useIOUs must be used within IOUProvider");
  }
  return ctx;
}

export default function IOUProvider({ children }: { children: ReactNode }) {
  const [ious, setIous] = useState<IOU[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIousFromDb();
      setIous(data);
    } catch (err: any) {
      setError(err.message ?? "Unable to load IOUs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addIou = async (iou: NewIouPayload) => {
    try {
      setError(null);
      const saved = await addIouToDb(iou);
      setIous((prev) => [saved, ...prev]);
    } catch (err: any) {
      setError(err.message ?? "Unable to create IOU");
      throw err;
    }
  };

  const setSettlement = async (id: string, isSettled: boolean) => {
    try {
      setError(null);
      const updated = await updateIouInDb(id, { is_settled: isSettled });
      setIous((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err: any) {
      setError(err.message ?? "Unable to update IOU");
      throw err;
    }
  };

  const removeIou = async (id: string) => {
    try {
      setError(null);
      await deleteIouFromDb(id);
      setIous((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message ?? "Unable to delete IOU");
      throw err;
    }
  };

  return (
    <IOUContext.Provider
      value={{ ious, loading, error, refresh, addIou, setSettlement, removeIou }}
    >
      {children}
    </IOUContext.Provider>
  );
}
