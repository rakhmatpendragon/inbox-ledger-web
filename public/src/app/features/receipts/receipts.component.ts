import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
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
  readonly columns: readonly string[] = ['received', 'from', 'subject', 'status', 'result'];

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

  onTabChange(event: MatTabChangeEvent): void {
    const next = this.tabs[event.index] ?? 'All';
    this.tab$.next(next);
  }

  copyAddress(address: string): void {
    this.clipboard.copy(address);
    this.snackBar.open('Copied!', undefined, { duration: 2000 });
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

  trackById(_: number, receipt: Receipt): string {
    return receipt.id;
  }
}

