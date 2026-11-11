import { Transaction } from './transaction.model';

export interface MerchantTotal {
  name: string;
  amount: number;
}

export interface DashboardSummary {
  month: string;
  totalSpent: number;
  transactionCount: number;
  fromForwardedReceipts: number;
  receiptsParsed: number;
  receiptsNeedReview: number;
  budgetsNearLimit: number;
  budgetsNearLimitNames: string[];
  topMerchants: MerchantTotal[];
  recentTransactions: Transaction[];
}

