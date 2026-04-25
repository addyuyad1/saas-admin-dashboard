import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  delay,
  forkJoin,
  of,
  take,
} from 'rxjs';

import {
  LiveActivityItem,
  RealtimeUpdatesService,
} from '../../../../core/services/realtime-updates.service';
import { ChartDatum } from '../../../../shared/components/charts/chart.models';
import { DashboardData } from '../../models/dashboard-data.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  readonly skeletonCards = [1, 2, 3, 4];
  readonly skeletonPanels = [1, 2];
  readonly skeletonRows = [1, 2, 3, 4];
  readonly activityFeed$: Observable<LiveActivityItem[]>;
  revenueTrendData: ChartDatum[] = [];
  userGrowthData: ChartDatum[] = [];
  private readonly dashboardDataSubject = new BehaviorSubject<DashboardData | null>(
    null,
  );
  readonly dashboardData$ = this.dashboardDataSubject.asObservable();

  errorMessage = '';
  insightResponse =
    'Ask for a revenue, growth, or user trend summary to surface a quick executive-style insight.';
  hasLoadedData = false;
  isLoading = true;
  isRefreshing = false;
  isInsightLoading = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dashboardService: DashboardService,
    realtimeUpdatesService: RealtimeUpdatesService,
  ) {
    this.activityFeed$ = realtimeUpdatesService.activityFeed$;
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const isInitialLoad = !this.hasLoadedData;

    this.isLoading = isInitialLoad;
    this.isRefreshing = !isInitialLoad;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    forkJoin({
      dashboardData: this.dashboardService.getDashboardData(),
      revenueTrendData: this.dashboardService.getRevenueTrendData(),
      userGrowthData: this.dashboardService.getUserGrowthData(),
    })
      .pipe(take(1))
      .subscribe(({ dashboardData, revenueTrendData, userGrowthData }) => {
        this.dashboardDataSubject.next(dashboardData);
        this.revenueTrendData = revenueTrendData;
        this.userGrowthData = userGrowthData;
        this.hasLoadedData = true;
        this.isLoading = false;
        this.isRefreshing = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  generateInsight(prompt: string): void {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt) {
      return;
    }

    this.isInsightLoading = true;

    of(this.buildInsightResponse(normalizedPrompt))
      .pipe(delay(350), take(1))
      .subscribe((response) => {
        this.insightResponse = response;
        this.isInsightLoading = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  private buildInsightResponse(prompt: string): string {
    const normalizedPrompt = prompt.toLowerCase();

    if (normalizedPrompt.includes('revenue')) {
      return 'Revenue remains healthy at $54k, with current growth suggesting the team should prioritize expansion accounts and high-intent renewals this week.';
    }

    if (normalizedPrompt.includes('user')) {
      return 'User volume is stable at 1,240 accounts. The strongest opportunity is converting active Growth accounts into higher-retention enterprise cohorts.';
    }

    if (normalizedPrompt.includes('session')) {
      return 'Session volume is strong at 18,400, which indicates healthy engagement. Review high-traffic segments to confirm product adoption is translating into revenue expansion.';
    }

    return 'Growth is positive at 12%, which points to a healthy operating baseline. The most practical next step is pairing user activity trends with account expansion opportunities in the users workspace.';
  }
}
