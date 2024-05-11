export type Payment = {
  id: string;
  amount: number;
  status: "not started" | "ongoing" | "completed";
  name: string;
  enrollementDate: Date | string;
};