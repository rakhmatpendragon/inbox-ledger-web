import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';

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

  readonly user$ = inject(AuthService).user$;

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

  retry(): void {
    this.reload$.next();
  }
}

