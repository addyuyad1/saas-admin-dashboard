import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardApiService } from '../../../core/services/api/dashboard.service';
import { ChartDatum } from '../../../shared/components/charts/chart.models';
import { DashboardData } from '../models/dashboard-data.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly dashboardApiService: DashboardApiService) {}

  getDashboardData(): Observable<DashboardData> {
    return this.dashboardApiService.getDashboardData();
  }

  getRevenueTrendData(): Observable<ChartDatum[]> {
    return this.dashboardApiService.getRevenueTrendData();
  }

  getUserGrowthData(): Observable<ChartDatum[]> {
    return this.dashboardApiService.getUserGrowthData();
  }
}
