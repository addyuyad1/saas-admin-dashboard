import { ChartDatum, TimeSeriesDatum } from './chart-datum.model';
import { DashboardStat } from './dashboard-stat.model';

export interface DashboardData {
  kpis: DashboardStat[];
  revenueSeries: TimeSeriesDatum[];
  signupsBySource: ChartDatum[];
  usersByPlan: ChartDatum[];
  lastUpdated: string;
}
