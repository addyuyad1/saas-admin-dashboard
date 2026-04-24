import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

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
}
