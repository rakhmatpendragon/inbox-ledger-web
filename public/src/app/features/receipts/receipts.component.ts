import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@app/core/auth/auth.service';
import { IngestionStats, Receipt, ReceiptStatus } from '@app/core/models';
import { withLoadState } from '@app/core/utils/load-state';
import { ReceiptsService } from './receipts.service';

type TabFilter = 'All' | ReceiptStatus;

interface ReceiptsVm {
  stats: IngestionStats;
  receipts: Receipt[];
  filtered: Receipt[];
  activeTab: TabFilter;
}

@Component({
  selector: 'app-receipts',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipts.component.html',
})
export class ReceiptsComponent {
  private readonly receiptsService = inject(ReceiptsService);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);
  private readonly reload$ = new BehaviorSubject<void>(undefined);
  private readonly tab$ = new BehaviorSubject<TabFilter>('All');

  readonly user$ = inject(AuthService).user$;
  readonly fallbackAddress = environment.receiptsAddress;

  readonly tabs: readonly TabFilter[] = ['All', 'Parsed', 'Failed', 'Duplicate'];
  /** True briefly after the receipts address was copied. */
  readonly copied = signal(false);
  private copiedTimer?: ReturnType<typeof setTimeout>;

  private readonly dataState$ = this.reload$.pipe(
    switchMap(() =>
      withLoadState(
        combineLatest([this.receiptsService.getStats(), this.receiptsService.getReceipts()]),
      ),
    ),
  );

  readonly vm$ = combineLatest([this.dataState$, this.tab$]).pipe(
    map(([state, activeTab]) => {
      const [stats, receipts] = state.data ?? [null, []];
      const filtered =
        activeTab === 'All' ? receipts : receipts.filter((r) => r.status === activeTab);
      const data: ReceiptsVm | null = stats
        ? { stats, receipts, filtered, activeTab }
        : null;
      return {
        loading: state.loading,
        error: state.error,
        data,
      };
    }),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedTimer));
  }

  selectTab(tab: TabFilter): void {
    this.tab$.next(tab);
  }

  copyAddress(address: string): void {
    if (!this.clipboard.copy(address)) {
      this.snackBar.open('Could not copy address', 'Dismiss', { duration: 3500 });
      return;
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
  }

  retryReceipt(receipt: Receipt): void {
    this.receiptsService.retryReceipt(receipt.id).subscribe({
      next: () =>
        this.snackBar.open('Queued for retry', undefined, { duration: 2500 }),
      error: () =>
        this.snackBar.open('Could not retry receipt', 'Dismiss', { duration: 3500 }),
    });
  }

  retry(): void {
    this.reload$.next();
  }
}

