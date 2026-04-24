export interface DashboardStat {
  id: 'users' | 'revenue' | 'growth' | 'retention';
  label: string;
  value: string;
  trend: string;
  helperText: string;
}
