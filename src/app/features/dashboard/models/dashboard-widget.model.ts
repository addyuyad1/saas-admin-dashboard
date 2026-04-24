export type DashboardWidgetId =
  | 'revenue-trend'
  | 'signup-sources'
  | 'user-distribution'
  | 'recent-activity'
  | 'notifications';

export interface DashboardWidget {
  id: DashboardWidgetId;
  title: string;
  subtitle: string;
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
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
    id: 'recent-activity',
    title: 'Recent activity',
    subtitle: 'Simulated real-time operational updates coming from the workspace.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Priority alerts and operational follow-ups for the current workspace.',
  },
];
