import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';
import { MOCK_DASHBOARD } from '@app/core/mock/mock-data';
import { DashboardSummary } from '@app/core/models';
import { withMockLatency } from '@app/core/utils/load-state';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummary> {
    if (!environment.useMockData) {
      return this.http.get<DashboardSummary>(`${environment.apiBaseUrl}/dashboard/summary`);
    }
    return withMockLatency(of(MOCK_DASHBOARD));
  }
}

