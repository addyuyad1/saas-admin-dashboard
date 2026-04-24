import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { DashboardData } from '../../models/dashboard-data.model';
import {
  DASHBOARD_WIDGETS,
  DashboardWidget,
  DashboardWidgetId,
} from '../../models/dashboard-widget.model';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardWidgetService } from '../../services/dashboard-widget.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  readonly availableWidgets = DASHBOARD_WIDGETS;
  readonly skeletonCards = [1, 2, 3];

  data: DashboardData | null = null;
  errorMessage = '';
  isLoading = true;
  visibleWidgetIds: DashboardWidgetId[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardWidgetService: DashboardWidgetService,
  ) {}

  ngOnInit(): void {
    this.visibleWidgetIds = this.dashboardWidgetService.getVisibleWidgetIds();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService
      .getDashboardData()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.data = data;
        },
        error: (error: Error) => {
          this.data = null;
          this.errorMessage = error.message;
        },
      });
  }

  removeWidget(widgetId: DashboardWidgetId): void {
    this.visibleWidgetIds = this.dashboardWidgetService.removeWidget(widgetId);
  }

  restoreWidget(widgetId: DashboardWidgetId): void {
    this.visibleWidgetIds = this.dashboardWidgetService.restoreWidget(widgetId);
  }

  isWidgetVisible(widgetId: DashboardWidgetId): boolean {
    return this.visibleWidgetIds.includes(widgetId);
  }

  get hiddenWidgets(): DashboardWidget[] {
    return this.availableWidgets.filter(
      (widget) => !this.visibleWidgetIds.includes(widget.id),
    );
  }
}
