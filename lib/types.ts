export type IOU = {
  id?: string;
  description: string;
  amount: number;
  other_party: string;
  direction: "i_owe" | "i_am_owed";
  created_by_uid?: string | null;
  is_settled: boolean;
  created_at?: string;
};
