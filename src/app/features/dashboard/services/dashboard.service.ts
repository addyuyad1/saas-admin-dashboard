import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { DashboardData } from '../models/dashboard-data.model';

@Injectable()
export class DashboardService {
  getDashboardData(): Observable<DashboardData> {
    return of({
      users: 1240,
      revenue: 54000,
      growth: 12,
      sessions: 18400,
    }).pipe(delay(500));
  }
}
