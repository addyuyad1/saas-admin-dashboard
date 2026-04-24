import { Injectable } from '@angular/core';
import { Observable, catchError, delay, defer, of, throwError } from 'rxjs';

import { DashboardData } from '../models/dashboard-data.model';

@Injectable()
export class DashboardService {
  private readonly latencyMs = 850;

  getDashboardData(): Observable<DashboardData> {
    return defer(() =>
      of({
        kpis: [
          {
            id: 'users',
            label: 'Active users',
            value: '18,420',
            trend: '+12.4%',
            helperText: 'Compared with the previous 30 days',
          },
          {
            id: 'revenue',
            label: 'Monthly revenue',
            value: '$128,400',
            trend: '+8.2%',
            helperText: 'Recurring revenue booked this month',
          },
          {
            id: 'growth',
            label: 'Growth rate',
            value: '24.8%',
            trend: '+3.1%',
            helperText: 'Net expansion across active accounts',
          },
        ],
        revenueSeries: [
          { label: 'Jan', value: 82000 },
          { label: 'Feb', value: 89000 },
          { label: 'Mar', value: 94000 },
          { label: 'Apr', value: 101000 },
          { label: 'May', value: 117000 },
          { label: 'Jun', value: 128400 },
        ],
        signupsBySource: [
          { label: 'Organic', value: 164 },
          { label: 'Partners', value: 92 },
          { label: 'Paid search', value: 71 },
          { label: 'Referrals', value: 56 },
        ],
        usersByPlan: [
          { label: 'Starter', value: 5400 },
          { label: 'Growth', value: 7340 },
          { label: 'Enterprise', value: 5680 },
        ],
        lastUpdated: new Date().toLocaleString(),
      } satisfies DashboardData).pipe(delay(this.latencyMs)),
    ).pipe(
      catchError(() =>
        throwError(
          () =>
            new Error(
              'Dashboard data could not be loaded. Please try again in a moment.',
            ),
        ),
      ),
    );
  }
}
