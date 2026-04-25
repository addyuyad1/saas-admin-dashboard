import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ChartDatum } from '../../../shared/components/charts/chart.models';
import { AnalyticsKpi } from '../models/analytics-kpi.model';

@Injectable()
export class AnalyticsService {
  getKpis(): AnalyticsKpi[] {
    return [
      { label: 'Activation rate', value: '74%', insight: 'Up after onboarding refresh' },
      { label: 'NPS trend', value: '+21', insight: 'Support response time improving' },
      { label: 'Weekly sessions', value: '18.4k', insight: 'Stable across all segments' },
    ];
  }

  generateInsight(query: string): Observable<string> {
    return of(
      `Mock insight: Based on "${query}", retention and expansion appear strongest in enterprise accounts. The next recommended step is to compare adoption trends by plan and review any recent onboarding changes before acting.`,
    ).pipe(delay(700));
  }

  getWeeklySessionsData(): ChartDatum[] {
    return [
      { name: 'Mon', value: 2400 },
      { name: 'Tue', value: 2780 },
      { name: 'Wed', value: 2920 },
      { name: 'Thu', value: 3180 },
      { name: 'Fri', value: 3010 },
      { name: 'Sat', value: 2240 },
      { name: 'Sun', value: 1860 },
    ];
  }

  getGrowthTrendData(): ChartDatum[] {
    return [
      { name: 'Jan', value: 8 },
      { name: 'Feb', value: 10 },
      { name: 'Mar', value: 11 },
      { name: 'Apr', value: 13 },
      { name: 'May', value: 14 },
      { name: 'Jun', value: 17 },
    ];
  }

  getPlanDistributionData(): ChartDatum[] {
    return [
      { name: 'Starter', value: 320 },
      { name: 'Growth', value: 610 },
      { name: 'Enterprise', value: 310 },
    ];
  }
}
