import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Transaction } from '@app/core/models';

/** Presentational transactions table, reused by the dashboard and transactions page. */
@Component({
  selector: 'app-transaction-table',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './transaction-table.component.html',
})
export class TransactionTableComponent {
  @Input({ required: true }) transactions: Transaction[] = [];
  @Input() emptyTitle = 'No transactions yet';
  @Input() emptyMessage = 'Forward a payment email to see it here.';

  readonly columns: readonly string[] = ['date', 'merchant', 'source', 'category', 'amount'];

  trackById(_: number, tx: Transaction): string {
    return tx.id;
  }
}

