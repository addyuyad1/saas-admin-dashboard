import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DashboardStat } from '../../models/dashboard-stat.model';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  @Input({ required: true }) stat!: DashboardStat;
}
