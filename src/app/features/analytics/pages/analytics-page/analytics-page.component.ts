import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { AnalyticsInsight } from '../../../../core/services/api/analytics.service';
import { ChartDatum } from '../../../../shared/components/charts/chart.models';
import { AnalyticsKpi } from '../../models/analytics-kpi.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);

  kpis: AnalyticsKpi[] = [];
  insightHighlights: AnalyticsInsight[] = [];
  revenueTrendData: ChartDatum[] = [];
  userGrowthData: ChartDatum[] = [];
  weeklySessionsData: ChartDatum[] = [];
  planDistributionData: ChartDatum[] = [];
  isLoading = true;
  insightResponse = '';
  isGenerating = false;

  readonly insightForm = this.formBuilder.nonNullable.group({
    query: ['What changed in growth this week?', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  generateInsight(): void {
    if (this.insightForm.invalid) {
      this.insightForm.markAllAsTouched();
      return;
    }

    this.isGenerating = true;
    this.analyticsService
      .generateInsight(this.insightForm.getRawValue().query)
      .pipe(
        finalize(() => {
          this.isGenerating = false;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe((response) => {
        this.insightResponse = response;
        this.changeDetectorRef.markForCheck();
      });
  }

  private loadAnalytics(): void {
    this.isLoading = true;

    forkJoin({
      kpis: this.analyticsService.getKpis(),
      insightHighlights: this.analyticsService.getInsightHighlights(),
      revenueTrendData: this.analyticsService.getRevenueTrendData(),
      userGrowthData: this.analyticsService.getUserGrowthData(),
      weeklySessionsData: this.analyticsService.getWeeklySessionsData(),
      planDistributionData: this.analyticsService.getPlanDistributionData(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe((response) => {
        this.kpis = response.kpis;
        this.insightHighlights = response.insightHighlights;
        this.revenueTrendData = response.revenueTrendData;
        this.userGrowthData = response.userGrowthData;
        this.weeklySessionsData = response.weeklySessionsData;
        this.planDistributionData = response.planDistributionData;
      });
  }
}
