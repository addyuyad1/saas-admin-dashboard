export type DashboardWidgetId =
  | 'kpis'
  | 'revenue-trend'
  | 'signup-sources'
  | 'user-distribution'
  | 'live-activity';

export interface DashboardWidget {
  id: DashboardWidgetId;
  title: string;
  subtitle: string;
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'kpis',
    title: 'Key performance indicators',
    subtitle: 'Top-level usage, revenue, and growth signals for the current period.',
  },
  {
    id: 'revenue-trend',
    title: 'Revenue trend',
    subtitle: 'Monthly recurring revenue over the last six months.',
  },
  {
    id: 'signup-sources',
    title: 'Signup sources',
    subtitle: 'Where the newest user acquisition is coming from this month.',
  },
  {
    id: 'user-distribution',
    title: 'Plan distribution',
    subtitle: 'A quick view of how active users are distributed by plan tier.',
  },
  {
    id: 'live-activity',
    title: 'Live activity',
    subtitle: 'Simulated real-time operational updates coming from the workspace.',
  },
];
