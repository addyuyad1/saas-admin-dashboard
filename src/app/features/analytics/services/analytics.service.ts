import { Injectable } from '@angular/core';

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
}
