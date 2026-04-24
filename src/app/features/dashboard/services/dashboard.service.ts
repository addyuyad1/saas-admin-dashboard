import { Injectable } from '@angular/core';

import { DashboardStat } from '../models/dashboard-stat.model';

@Injectable()
export class DashboardService {
  getStats(): DashboardStat[] {
    return [
      { label: 'Monthly recurring revenue', value: '$128,400', trend: '+8.2%' },
      { label: 'Active subscriptions', value: '3,842', trend: '+4.6%' },
      { label: 'Open support escalations', value: '12', trend: '-18.0%' },
    ];
  }
}
