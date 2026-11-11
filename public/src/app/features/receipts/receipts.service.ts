import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { environment } from '@env/environment';
import { MOCK_INGESTION_STATS, MOCK_RECEIPTS } from '@app/core/mock/mock-data';
import { IngestionStats, Receipt, ReceiptStatus } from '@app/core/models';
import { withMockLatency } from '@app/core/utils/load-state';

@Injectable({ providedIn: 'root' })
export class ReceiptsService {
  private readonly http = inject(HttpClient);
  private readonly receiptsSubject = new BehaviorSubject<Receipt[]>(
    MOCK_RECEIPTS.map((r) => ({ ...r })),
  );
  private readonly statsSubject = new BehaviorSubject<IngestionStats>({
    ...MOCK_INGESTION_STATS,
  });

  getStats(): Observable<IngestionStats> {
    if (!environment.useMockData) {
      return this.http.get<IngestionStats>(`${environment.apiBaseUrl}/receipts/stats`);
    }
    return withMockLatency(this.statsSubject.asObservable());
  }

  getReceipts(status?: ReceiptStatus): Observable<Receipt[]> {
    if (!environment.useMockData) {
      const params = status ? new HttpParams().set('status', status) : undefined;
      return this.http.get<Receipt[]>(`${environment.apiBaseUrl}/receipts`, { params });
    }
    return withMockLatency(
      this.receiptsSubject
        .asObservable()
        .pipe(map((list) => (status ? list.filter((r) => r.status === status) : list))),
    );
  }

  retryReceipt(id: string): Observable<void> {
    if (!environment.useMockData) {
      return this.http.post<void>(`${environment.apiBaseUrl}/receipts/${id}/retry`, {});
    }
    const updated = this.receiptsSubject.value.map((r): Receipt =>
      r.id === id ? { ...r, status: 'Processing', result: 'In queue' } : r,
    );
    this.receiptsSubject.next(updated);
    const current = this.statsSubject.value;
    this.statsSubject.next({
      ...current,
      inQueue: current.inQueue + 1,
      failed: Math.max(0, current.failed - 1),
    });
    return of(undefined);
  }
}

