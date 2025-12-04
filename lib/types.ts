export type IOU = {
  id?: string;
  description: string;
  amount: number;
  involved_party: string;
  is_settled: boolean;
  transaction_type: "OWE" | "OWED";
  created_at?: string;
};
