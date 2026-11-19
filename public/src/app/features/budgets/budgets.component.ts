import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, filter, switchMap } from 'rxjs';

import { Budget, BudgetDraft } from '@app/core/models';
import { withLoadState } from '@app/core/utils/load-state';
import { BudgetDialogComponent } from './budget-dialog.component';
import { BudgetService } from './budget.service';

@Component({
  selector: 'app-budgets',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budgets.component.html',
})
export class BudgetsComponent {
  private readonly budgetService = inject(BudgetService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly state$ = this.reload$.pipe(
    switchMap(() => withLoadState(this.budgetService.getBudgets())),
  );

  openCreateDialog(): void {
    this.dialog
      .open<BudgetDialogComponent, undefined, BudgetDraft>(BudgetDialogComponent, {
        width: '420px',
      })
      .afterClosed()
      .pipe(
        filter((draft): draft is BudgetDraft => Boolean(draft)),
        switchMap((draft) => this.budgetService.createBudget(draft)),
      )
      .subscribe({
        next: () => this.snackBar.open('Budget created', undefined, { duration: 2500 }),
        error: () =>
          this.snackBar.open('Could not create budget', 'Dismiss', { duration: 3500 }),
      });
  }

  openEditDialog(budget: Budget): void {
    this.dialog
      .open<BudgetDialogComponent, { budget: Budget }, BudgetDraft>(BudgetDialogComponent, {
        width: '420px',
        data: { budget },
      })
      .afterClosed()
      .pipe(
        filter((draft): draft is BudgetDraft => Boolean(draft)),
        switchMap((draft) => this.budgetService.updateBudget(budget.id, draft)),
      )
      .subscribe({
        next: () => this.snackBar.open('Budget updated', undefined, { duration: 2500 }),
        error: () =>
          this.snackBar.open('Could not update budget', 'Dismiss', { duration: 3500 }),
      });
  }

  deleteBudget(budget: Budget): void {
    this.budgetService.deleteBudget(budget.id).subscribe({
      next: () => this.snackBar.open('Budget deleted', undefined, { duration: 2500 }),
      error: () =>
        this.snackBar.open('Could not delete budget', 'Dismiss', { duration: 3500 }),
    });
  }

  retry(): void {
    this.reload$.next();
  }
}

