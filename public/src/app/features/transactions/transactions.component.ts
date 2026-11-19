import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { CATEGORIES, SOURCES } from '@app/core/mock/mock-data';
import { Transaction, TransactionSource } from '@app/core/models';
import { withLoadState } from '@app/core/utils/load-state';
import { TransactionService, filterTransactions } from './transaction.service';

interface PageState {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-transactions',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly reload$ = new BehaviorSubject<void>(undefined);
  private readonly page$ = new BehaviorSubject<PageState>({ pageIndex: 0, pageSize: 10 });

  readonly categories = CATEGORIES;
  readonly sources = SOURCES;
  readonly pageSizeOptions = [10, 25, 50];

  readonly filterForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    source: new FormControl<TransactionSource | ''>('', { nonNullable: true }),
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private readonly filters$ = this.filterForm.valueChanges.pipe(
    startWith(null),
    map(() => this.filterForm.getRawValue()),
  );

  private readonly state$ = this.reload$.pipe(
    switchMap(() => withLoadState(this.transactionService.getTransactions())),
  );

  readonly vm$ = combineLatest([this.state$, this.filters$, this.page$]).pipe(
    map(([state, filters, page]) => {
      const filtered = state.data ? filterTransactions(state.data, filters) : [];
      const startIndex = page.pageIndex * page.pageSize;
      return {
        loading: state.loading,
        error: state.error,
        filtered,
        pageItems: filtered.slice(startIndex, startIndex + page.pageSize),
        total: filtered.length,
        ...page,
        hasFilters: Object.values(filters).some((v) => v !== '' && v !== null),
      };
    }),
  );

  constructor() {
    // Any filter change sends the user back to the first page.
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.page$.next({ ...this.page$.value, pageIndex: 0 }));
  }

  onPage(event: PageEvent): void {
    this.page$.next({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  retry(): void {
    this.reload$.next();
  }

  exportCsv(rows: Transaction[]): void {
    const escape = (value: string | number): string => {
      const s = String(value);
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines: (string | number)[][] = [
      ['Date', 'Merchant', 'Source', 'Category', 'Amount (IDR)'],
      ...rows.map((t) => [t.date, t.merchant, t.source, t.category, t.amount]),
    ];
    const csv = lines.map((line) => line.map(escape).join(',')).join('\r\n');

    // BOM so Excel opens UTF-8 (e.g. "—") correctly.
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inbox-ledger-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

