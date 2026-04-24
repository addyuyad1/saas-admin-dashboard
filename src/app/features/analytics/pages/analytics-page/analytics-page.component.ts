import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AnalyticsKpi } from '../../models/analytics-kpi.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent {
  readonly kpis: AnalyticsKpi[];

  constructor(private readonly analyticsService: AnalyticsService) {
    this.kpis = analyticsService.getKpis();
  }
}
