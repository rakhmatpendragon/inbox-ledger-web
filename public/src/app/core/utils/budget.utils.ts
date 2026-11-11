import { Budget } from '../models';

/** Usage as a percentage (not capped — may exceed 100). */
export function budgetUsagePercent(budget: Budget): number {
  return budget.limit > 0 ? (budget.used / budget.limit) * 100 : 0;
}

export function isBudgetNearLimit(budget: Budget): boolean {
  return budgetUsagePercent(budget) >= budget.alertThreshold * 100;
}

