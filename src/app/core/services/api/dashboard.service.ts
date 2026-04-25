import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ChartDatum } from '../../models/chart.model';
import { DashboardModel } from '../../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/dashboard`;
  private readonly fallbackDashboardData: DashboardModel = {
    users: 1240,
    revenue: 54000,
    growth: 12,
    sessions: 18400,
  };
  private readonly fallbackRevenueTrendData: ChartDatum[] = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 18000 },
    { name: 'Mar', value: 22000 },
    { name: 'Apr', value: 30000 },
    { name: 'May', value: 36000 },
    { name: 'Jun', value: 54000 },
  ];
  private readonly fallbackUserGrowthData: ChartDatum[] = [
    { name: 'Jan', value: 420 },
    { name: 'Feb', value: 610 },
    { name: 'Mar', value: 760 },
    { name: 'Apr', value: 930 },
    { name: 'May', value: 1080 },
    { name: 'Jun', value: 1240 },
  ];

  constructor(private readonly http: HttpClient) {}

  getDashboardData(): Observable<DashboardModel> {
    return this.http
      .get<DashboardModel>(`${this.apiUrl}/summary`)
      .pipe(
        catchError(() => of(this.fallbackDashboardData).pipe(delay(350))),
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
}
