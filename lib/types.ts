export type IOU = {
  id?: string;
  name: string;
  amount: number;
  currency: string;
  category: string;
  type: string; // "credit" | "debit"
  paid: boolean;
  date: string; // ISO date string
};
