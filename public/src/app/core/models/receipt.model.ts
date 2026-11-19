export type ReceiptStatus = 'Parsed' | 'Failed' | 'Duplicate' | 'Processing';

export interface Receipt {
  id: string;
  /** ISO 8601 */
  receivedAt: string;
  from: string;
  subject: string;
  status: ReceiptStatus;
  /** Amount string or error reason */
  result: string | null;
}

export interface IngestionStats {
  parsed: number;
  inQueue: number;
  duplicatesSkipped: number;
  failed: number;
}

