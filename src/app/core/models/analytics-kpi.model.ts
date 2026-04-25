export interface AnalyticsKpi {
  label: string;
  value: string;
  comparison: string;
  timeframe: string;
  insight: string;
  trend: 'up' | 'down' | 'neutral';
}
