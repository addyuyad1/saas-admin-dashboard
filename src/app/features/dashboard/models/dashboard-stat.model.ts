export interface DashboardStat {
  id: 'users' | 'revenue' | 'growth';
  label: string;
  value: string;
  trend: string;
  helperText: string;
}
