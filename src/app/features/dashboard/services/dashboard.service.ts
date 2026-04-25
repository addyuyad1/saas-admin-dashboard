import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ChartDatum } from '../../../shared/components/charts/chart.models';
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

  getRevenueTrendData(): ChartDatum[] {
    return [
      { name: 'Jan', value: 12000 },
      { name: 'Feb', value: 18000 },
      { name: 'Mar', value: 22000 },
      { name: 'Apr', value: 30000 },
      { name: 'May', value: 36000 },
      { name: 'Jun', value: 54000 },
    ];
  }

  getUserGrowthData(): ChartDatum[] {
    return [
      { name: 'Jan', value: 420 },
      { name: 'Feb', value: 610 },
      { name: 'Mar', value: 760 },
      { name: 'Apr', value: 930 },
      { name: 'May', value: 1080 },
      { name: 'Jun', value: 1240 },
    ];
  }
}
