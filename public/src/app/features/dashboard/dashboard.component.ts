import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@app/core/auth/auth.service';
import { Budget, DashboardSummary } from '@app/core/models';
import { isBudgetNearLimit } from '@app/core/utils/budget.utils';
import { withLoadState } from '@app/core/utils/load-state';
import { BudgetService } from '../budgets/budget.service';
import { DashboardService } from './dashboard.service';

interface DashboardVm {
  summary: DashboardSummary;
  budgets: Budget[];
  nearLimitCount: number;
  nearLimitLabel: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly budgetService = inject(BudgetService);
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  private readonly clipboard = inject(Clipboard);
  private copiedTimer?: ReturnType<typeof setTimeout>;

  readonly user$ = inject(AuthService).user$;
  readonly fallbackAddress = environment.receiptsAddress;
  /** True briefly after the receipts address was copied. */
  readonly copied = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedTimer));
  }

  readonly state$ = this.reload$.pipe(
    switchMap(() =>
      withLoadState(
        combineLatest([this.dashboardService.getSummary(), this.budgetService.getBudgets()]).pipe(
          map(([summary, budgets]): DashboardVm => {
            // Derived from live budgets so edits on the Budgets page are reflected here.
            const nearLimit = budgets.filter(isBudgetNearLimit);
            return {
              summary,
              budgets,
              nearLimitCount: nearLimit.length,
              nearLimitLabel: nearLimit.length
                ? nearLimit.map((b) => b.name.split(' ')[0]).join(', ')
                : 'All within limits',
            };
          }),
        ),
      ),
    ),
  );

  copyAddress(address: string): void {
    if (!this.clipboard.copy(address)) {
      return;
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
  }

  retry(): void {
    this.reload$.next();
  }
}

