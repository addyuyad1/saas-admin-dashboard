import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AnalyticsApiService,
  AnalyticsInsight,
} from '../../../core/services/api/analytics.service';
import { ChartDatum } from '../../../shared/components/charts/chart.models';
import { AnalyticsKpi } from '../models/analytics-kpi.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private readonly analyticsApiService: AnalyticsApiService) {}

  getKpis(): Observable<AnalyticsKpi[]> {
    return this.analyticsApiService.getKpis();
  }

  generateInsight(query: string): Observable<string> {
    return this.analyticsApiService.generateInsight(query);
  }

  getInsightHighlights(): Observable<AnalyticsInsight[]> {
    return this.analyticsApiService.getInsightHighlights();
  }

  getRevenueTrendData(): Observable<ChartDatum[]> {
    return this.analyticsApiService.getRevenueTrendData();
  }

  getUserGrowthData(): Observable<ChartDatum[]> {
    return this.analyticsApiService.getUserGrowthData();
  }

  getWeeklySessionsData(): Observable<ChartDatum[]> {
    return this.analyticsApiService.getWeeklySessionsData();
  }

  getPlanDistributionData(): Observable<ChartDatum[]> {
    return this.analyticsApiService.getPlanDistributionData();
  }
}
