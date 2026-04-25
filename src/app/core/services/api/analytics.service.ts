import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AnalyticsKpi } from '../../models/analytics-kpi.model';
import { ChartDatum } from '../../models/chart.model';

export interface AnalyticsInsight {
  title: string;
  summary: string;
  comparison: string;
}

interface AnalyticsInsightResponse {
  response: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/analytics`;
  private readonly fallbackKpis: AnalyticsKpi[] = [
    {
      label: 'Revenue',
      value: '$54k',
      comparison: '+8.4%',
      timeframe: 'Compared to last month',
      insight: 'Expansion revenue is strongest in enterprise cohorts.',
      trend: 'up',
    },
    {
      label: 'User growth',
      value: '+12%',
      comparison: '+3.1%',
      timeframe: 'Compared to last month',
      insight: 'Onboarding improvements continue to lift activation.',
      trend: 'up',
    },
    {
      label: 'Weekly sessions',
      value: '18.4k',
      comparison: '+5.6%',
      timeframe: 'Compared to last week',
      insight: 'Engagement remains healthy across weekday traffic.',
      trend: 'up',
    },
    {
      label: 'Enterprise mix',
      value: '25%',
      comparison: '+1.8%',
      timeframe: 'Compared to last month',
      insight: 'Higher-value plans are growing faster than self-serve tiers.',
      trend: 'up',
    },
  ];
  private readonly fallbackInsightHighlights: AnalyticsInsight[] = [
    {
      title: 'Acquisition momentum',
      summary:
        'User growth increased by 12% due to onboarding improvements and faster team activation.',
      comparison:
        'Compared to last month, sign-up to activation time is down by 9%.',
    },
    {
      title: 'Revenue quality',
      summary:
        'Revenue is expanding with a healthier plan mix, led by stronger conversion into Growth and Enterprise tiers.',
      comparison:
        'Compared to last month, expansion MRR is up 8.4% while churn stayed flat.',
    },
    {
      title: 'Engagement pattern',
      summary:
        'Session volume peaks midweek, which suggests product adoption is concentrated around collaborative workflows.',
      comparison:
        'Compared to last week, Wednesday and Thursday sessions are both up more than 6%.',
    },
  ];
  private readonly fallbackRevenueTrendData: ChartDatum[] = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 18000 },
    { name: 'Mar', value: 22000 },
    { name: 'Apr', value: 30000 },
    { name: 'May', value: 38000 },
    { name: 'Jun', value: 54000 },
  ];
  private readonly fallbackUserGrowthData: ChartDatum[] = [
    { name: 'Jan', value: 620 },
    { name: 'Feb', value: 760 },
    { name: 'Mar', value: 910 },
    { name: 'Apr', value: 1030 },
    { name: 'May', value: 1120 },
    { name: 'Jun', value: 1240 },
  ];
  private readonly fallbackWeeklySessionsData: ChartDatum[] = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 2780 },
    { name: 'Wed', value: 2920 },
    { name: 'Thu', value: 3180 },
    { name: 'Fri', value: 3010 },
    { name: 'Sat', value: 2240 },
    { name: 'Sun', value: 1860 },
  ];
  private readonly fallbackPlanDistributionData: ChartDatum[] = [
    { name: 'Starter', value: 320 },
    { name: 'Growth', value: 610 },
    { name: 'Enterprise', value: 310 },
  ];

  constructor(private readonly http: HttpClient) {}

  getKpis(): Observable<AnalyticsKpi[]> {
    return this.http
      .get<AnalyticsKpi[]>(`${this.apiUrl}/kpis`)
      .pipe(catchError(() => of(this.fallbackKpis).pipe(delay(300))));
  }

  getInsightHighlights(): Observable<AnalyticsInsight[]> {
    return this.http
      .get<AnalyticsInsight[]>(`${this.apiUrl}/insights/highlights`)
      .pipe(
        catchError(() =>
          of(this.fallbackInsightHighlights).pipe(delay(300)),
        ),
      );
  }

  getRevenueTrendData(): Observable<ChartDatum[]> {
    return this.http
      .get<ChartDatum[]>(`${this.apiUrl}/revenue-trend`)
      .pipe(
        catchError(() => of(this.fallbackRevenueTrendData).pipe(delay(250))),
      );
  }

  getUserGrowthData(): Observable<ChartDatum[]> {
    return this.http
      .get<ChartDatum[]>(`${this.apiUrl}/user-growth`)
      .pipe(
        catchError(() => of(this.fallbackUserGrowthData).pipe(delay(250))),
      );
  }

  getWeeklySessionsData(): Observable<ChartDatum[]> {
    return this.http
      .get<ChartDatum[]>(`${this.apiUrl}/weekly-sessions`)
      .pipe(
        catchError(() => of(this.fallbackWeeklySessionsData).pipe(delay(250))),
      );
  }

  getPlanDistributionData(): Observable<ChartDatum[]> {
    return this.http
      .get<ChartDatum[]>(`${this.apiUrl}/plan-distribution`)
      .pipe(
        catchError(() =>
          of(this.fallbackPlanDistributionData).pipe(delay(250)),
        ),
      );
  }

  generateInsight(query: string): Observable<string> {
    return this.http
      .post<AnalyticsInsightResponse>(`${this.apiUrl}/insights`, { query })
      .pipe(
        map((response) => response.response),
        catchError(() =>
          of(
            `Mock insight: Based on "${query}", retention and expansion appear strongest in enterprise accounts. The next recommended step is to compare adoption trends by plan and review any recent onboarding changes before acting.`,
          ).pipe(delay(700)),
        ),
      );
  }
}
