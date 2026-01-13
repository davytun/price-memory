export interface Purchase {
  id: string; // uuid
  itemName: string;
  amount: number; // Naira
  purchasedAt: string; // ISO date-time
  note?: string;
  invoicePhoto?: {
    name: string;
    type: string;
    dataUrl: string; // base64
  };
}
