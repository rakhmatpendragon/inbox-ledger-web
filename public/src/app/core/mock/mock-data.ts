import { environment } from '@env/environment';

import {
  AppUser,
  Budget,
  DashboardSummary,
  IngestionStats,
  Receipt,
  Transaction,
  TransactionSource,
} from '../models';

export const CATEGORIES: readonly string[] = [
  'Food & drinks',
  'Transport',
  'Shopping',
  'Bills & utilities',
];

export const SOURCES: readonly TransactionSource[] = ['QRIS', 'E-wallet', 'Bank transfer', 'Bank'];

export const MOCK_USER: AppUser = {
  uid: 'mock-uid-123',
  displayName: 'Rakhmat',
  email: 'rakhmat@example.com',
  photoURL: null,
  receiptsAddress: environment.receiptsAddress,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2026-11-11T19:02:00', merchant: 'Coffee shop', source: 'QRIS', category: 'Food & drinks', amount: 38000, currency: 'IDR' },
  { id: 't2', date: '2026-11-11T12:40:00', merchant: 'Ride hailing', source: 'E-wallet', category: 'Transport', amount: 27500, currency: 'IDR' },
  { id: 't3', date: '2026-11-10T20:15:00', merchant: 'Food delivery', source: 'E-wallet', category: 'Food & drinks', amount: 86000, currency: 'IDR' },
  { id: 't4', date: '2026-11-10T09:03:00', merchant: 'Electricity (PLN)', source: 'Bank transfer', category: 'Bills & utilities', amount: 540000, currency: 'IDR' },
  { id: 't5', date: '2026-11-09T16:47:00', merchant: 'Online marketplace', source: 'Bank transfer', category: 'Shopping', amount: 249000, currency: 'IDR' },
  { id: 't6', date: '2026-11-09T08:21:00', merchant: 'Grocery store', source: 'QRIS', category: 'Food & drinks', amount: 312000, currency: 'IDR' },
  { id: 't7', date: '2026-11-08T18:30:00', merchant: 'Ride hailing', source: 'E-wallet', category: 'Transport', amount: 45000, currency: 'IDR' },
  { id: 't8', date: '2026-11-08T12:10:00', merchant: 'Food delivery', source: 'E-wallet', category: 'Food & drinks', amount: 72000, currency: 'IDR' },
  { id: 't9', date: '2026-11-07T19:45:00', merchant: 'Grocery store', source: 'QRIS', category: 'Food & drinks', amount: 268000, currency: 'IDR' },
  { id: 't10', date: '2026-11-07T08:05:00', merchant: 'Coffee shop', source: 'QRIS', category: 'Food & drinks', amount: 35000, currency: 'IDR' },
  { id: 't11', date: '2026-11-06T21:00:00', merchant: 'Internet provider', source: 'Bank transfer', category: 'Bills & utilities', amount: 350000, currency: 'IDR' },
  { id: 't12', date: '2026-11-06T13:22:00', merchant: 'Online marketplace', source: 'E-wallet', category: 'Shopping', amount: 189000, currency: 'IDR' },
  { id: 't13', date: '2026-11-05T17:40:00', merchant: 'Ride hailing', source: 'E-wallet', category: 'Transport', amount: 32000, currency: 'IDR' },
  { id: 't14', date: '2026-11-05T09:15:00', merchant: 'Grocery store', source: 'QRIS', category: 'Food & drinks', amount: 240000, currency: 'IDR' },
  { id: 't15', date: '2026-11-04T20:30:00', merchant: 'Food delivery', source: 'E-wallet', category: 'Food & drinks', amount: 94000, currency: 'IDR' },
  { id: 't16', date: '2026-11-04T07:50:00', merchant: 'Fuel station', source: 'QRIS', category: 'Transport', amount: 150000, currency: 'IDR' },
  { id: 't17', date: '2026-11-03T15:05:00', merchant: 'Clothing store', source: 'Bank transfer', category: 'Shopping', amount: 212000, currency: 'IDR' },
  { id: 't18', date: '2026-11-02T19:12:00', merchant: 'Coffee shop', source: 'QRIS', category: 'Food & drinks', amount: 42000, currency: 'IDR' },
  { id: 't19', date: '2026-11-02T10:00:00', merchant: 'Water utility (PDAM)', source: 'Bank transfer', category: 'Bills & utilities', amount: 210000, currency: 'IDR' },
  { id: 't20', date: '2026-11-01T12:30:00', merchant: 'Ride hailing', source: 'E-wallet', category: 'Transport', amount: 28000, currency: 'IDR' },
];

export const MOCK_DASHBOARD: DashboardSummary = {
  month: 'November 2026',
  totalSpent: 3970000,
  transactionCount: 48,
  fromForwardedReceipts: 48,
  receiptsParsed: 46,
  receiptsNeedReview: 2,
  budgetsNearLimit: 2,
  budgetsNearLimitNames: ['Food', 'Bills'],
  topMerchants: [
    { name: 'Grocery store', amount: 820000 },
    { name: 'Food delivery', amount: 610000 },
    { name: 'Electricity (PLN)', amount: 540000 },
    { name: 'Ride hailing', amount: 310000 },
    { name: 'Coffee shop', amount: 185000 },
  ],
  recentTransactions: MOCK_TRANSACTIONS.slice(0, 6),
};

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', name: 'Food & drinks', limit: 2000000, used: 1800000, alertThreshold: 0.9, alertSent: true },
  { id: 'b2', name: 'Transport', limit: 800000, used: 420000, alertThreshold: 0.9, alertSent: false },
  { id: 'b3', name: 'Shopping', limit: 1500000, used: 650000, alertThreshold: 0.9, alertSent: false },
  { id: 'b4', name: 'Bills & utilities', limit: 1200000, used: 1100000, alertThreshold: 0.9, alertSent: true },
];

export const MOCK_RECEIPTS: Receipt[] = [
  { id: 'r1', receivedAt: '2026-11-11T19:03:00', from: 'QRIS payment', subject: 'Payment successful — Coffee shop', status: 'Parsed', result: 'Rp 38.000' },
  { id: 'r2', receivedAt: '2026-11-11T19:03:00', from: 'QRIS payment', subject: 'Payment successful — Coffee shop', status: 'Duplicate', result: 'Skipped' },
  { id: 'r3', receivedAt: '2026-11-11T12:41:00', from: 'E-wallet', subject: 'Your ride receipt', status: 'Parsed', result: 'Rp 27.500' },
  { id: 'r4', receivedAt: '2026-11-11T08:10:00', from: 'Bank', subject: 'Monthly statement available', status: 'Failed', result: 'No parser' },
  { id: 'r5', receivedAt: '2026-11-10T20:16:00', from: 'E-wallet', subject: 'Order delivered — receipt', status: 'Processing', result: null },
  { id: 'r6', receivedAt: '2026-11-10T09:04:00', from: 'Bank', subject: 'Transfer notification', status: 'Parsed', result: 'Rp 540.000' },
];

export const MOCK_INGESTION_STATS: IngestionStats = {
  parsed: 46,
  inQueue: 1,
  duplicatesSkipped: 1,
  failed: 1,
};

