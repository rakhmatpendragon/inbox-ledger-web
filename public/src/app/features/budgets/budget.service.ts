import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { MOCK_BUDGETS } from '@app/core/mock/mock-data';
import { Budget, BudgetDraft } from '@app/core/models';
import { withMockLatency } from '@app/core/utils/load-state';
import { isBudgetNearLimit } from '@app/core/utils/budget.utils';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/budgets`;

  /** In-memory store used in mock mode so CRUD changes show up everywhere. */
  private readonly budgetsSubject = new BehaviorSubject<Budget[]>(
    MOCK_BUDGETS.map((b) => ({ ...b })),
  );

  getBudgets(): Observable<Budget[]> {
    if (!environment.useMockData) {
      return this.http.get<Budget[]>(this.url);
    }
    return withMockLatency(this.budgetsSubject.asObservable());
  }

  createBudget(draft: BudgetDraft): Observable<Budget> {
    if (!environment.useMockData) {
      return this.http.post<Budget>(this.url, draft);
    }
    const budget = this.withAlertState({
      id: crypto.randomUUID(),
      used: 0,
      alertSent: false,
      ...draft,
    });
    this.budgetsSubject.next([...this.budgetsSubject.value, budget]);
    return of(budget);
  }

  updateBudget(id: string, changes: Partial<BudgetDraft>): Observable<Budget> {
    if (!environment.useMockData) {
      return this.http.patch<Budget>(`${this.url}/${id}`, changes);
    }
    const existing = this.budgetsSubject.value.find((b) => b.id === id);
    if (!existing) {
      return throwError(() => new Error('Budget not found.'));
    }
    const updated = this.withAlertState({ ...existing, ...changes });
    this.budgetsSubject.next(this.budgetsSubject.value.map((b) => (b.id === id ? updated : b)));
    return of(updated);
  }

  deleteBudget(id: string): Observable<void> {
    if (!environment.useMockData) {
      return this.http.delete<void>(`${this.url}/${id}`);
    }
    this.budgetsSubject.next(this.budgetsSubject.value.filter((b) => b.id !== id));
    return of(undefined);
  }

  /** In mock mode the "backend" decides whether an alert has been sent. */
  private withAlertState(budget: Budget): Budget {
    return { ...budget, alertSent: isBudgetNearLimit(budget) };
  }
}

