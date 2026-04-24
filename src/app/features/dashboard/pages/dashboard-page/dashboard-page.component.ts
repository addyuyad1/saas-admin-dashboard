import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable, catchError, delay, of, shareReplay, take } from 'rxjs';

import {
  LiveActivityItem,
  RealtimeUpdatesService,
} from '../../../../core/services/realtime-updates.service';
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
  readonly activityFeed$: Observable<LiveActivityItem[]>;
  private readonly fallbackDashboardData: DashboardData = {
    users: 1240,
    revenue: 54000,
    growth: 12,
    sessions: 18400,
  };

  dashboardData$!: Observable<DashboardData>;
  errorMessage = '';
  insightResponse =
    'Ask for a revenue, growth, or user trend summary to surface a quick executive-style insight.';
  isLoading = true;
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
    this.isLoading = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.dashboardData$ = this.dashboardService.getDashboardData().pipe(
      catchError((error: Error) => {
        this.errorMessage =
          error.message || 'Dashboard data could not be loaded.';
        return of(this.fallbackDashboardData);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.dashboardData$.pipe(take(1)).subscribe(() => {
      this.isLoading = false;
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
