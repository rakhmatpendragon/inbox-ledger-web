export interface Budget {
  id: string;
  name: string;
  limit: number;
  used: number;
  /** e.g. 0.9 = alert at 90% of the limit */
  alertThreshold: number;
  alertSent: boolean;
}

/** Fields a user provides when creating or editing a budget. */
export type BudgetDraft = Pick<Budget, 'name' | 'limit' | 'alertThreshold'> &
  Partial<Pick<Budget, 'used'>>;

