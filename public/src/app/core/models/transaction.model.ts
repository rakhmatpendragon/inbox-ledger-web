export type TransactionSource = 'QRIS' | 'E-wallet' | 'Bank transfer' | 'Bank';

export interface Transaction {
  id: string;
  /** ISO 8601 */
  date: string;
  merchant: string;
  source: TransactionSource;
  category: string;
  /** In IDR (integer, no cents) */
  amount: number;
  currency: 'IDR';
}

export interface TransactionFilter {
  search?: string;
  category?: string;
  source?: TransactionSource | '';
  start?: Date | null;
  end?: Date | null;
}

