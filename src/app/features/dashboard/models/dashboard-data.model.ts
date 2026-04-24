import { ChartDatum, TimeSeriesDatum } from './chart-datum.model';
import { DashboardStat } from './dashboard-stat.model';

export interface DashboardNotification {
  title: string;
  detail: string;
  level: 'info' | 'success' | 'warning';
}

export interface DashboardData {
  kpis: DashboardStat[];
  revenueSeries: TimeSeriesDatum[];
  signupsBySource: ChartDatum[];
  usersByPlan: ChartDatum[];
  notifications: DashboardNotification[];
  lastUpdated: string;
}
