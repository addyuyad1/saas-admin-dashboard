import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DashboardStat } from '../../models/dashboard-stat.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  readonly stats: DashboardStat[];

  constructor(private readonly dashboardService: DashboardService) {
    this.stats = dashboardService.getStats();
  }
}
