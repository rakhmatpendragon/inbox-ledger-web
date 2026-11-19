import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';
import { MOCK_TRANSACTIONS } from '@app/core/mock/mock-data';
import { Transaction, TransactionFilter } from '@app/core/models';
import { withMockLatency } from '@app/core/utils/load-state';

/** Client-side filter; mirrors what the API will do server-side. */
export function filterTransactions(list: Transaction[], filter: TransactionFilter): Transaction[] {
  const search = filter.search?.trim().toLowerCase() ?? '';
  const start = filter.start ? new Date(filter.start).setHours(0, 0, 0, 0) : null;
  const end = filter.end ? new Date(filter.end).setHours(23, 59, 59, 999) : null;

  return list.filter((tx) => {
    const time = new Date(tx.date).getTime();
    return (
      (!search ||
        tx.merchant.toLowerCase().includes(search) ||
        tx.category.toLowerCase().includes(search)) &&
      (!filter.category || tx.category === filter.category) &&
      (!filter.source || tx.source === filter.source) &&
      (start === null || time >= start) &&
      (end === null || time <= end)
    );
  });
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);

  getTransactions(filter: TransactionFilter = {}): Observable<Transaction[]> {
    if (!environment.useMockData) {
      let params = new HttpParams();
      if (filter.search) params = params.set('search', filter.search);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.source) params = params.set('source', filter.source);
      if (filter.start) params = params.set('from', filter.start.toISOString());
      if (filter.end) params = params.set('to', filter.end.toISOString());
      return this.http.get<Transaction[]>(`${environment.apiBaseUrl}/transactions`, { params });
    }
    return withMockLatency(of(filterTransactions(MOCK_TRANSACTIONS, filter)));
  }
}

