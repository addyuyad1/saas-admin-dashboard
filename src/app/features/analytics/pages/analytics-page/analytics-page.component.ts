import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

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
export class AnalyticsPageComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly kpis: AnalyticsKpi[];
  readonly weeklySessionsData: ChartDatum[];
  readonly growthTrendData: ChartDatum[];
  readonly planDistributionData: ChartDatum[];
  insightResponse = '';
  isGenerating = false;

  readonly insightForm = this.formBuilder.nonNullable.group({
    query: ['What changed in growth this week?', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {
    this.kpis = analyticsService.getKpis();
    this.weeklySessionsData = analyticsService.getWeeklySessionsData();
    this.growthTrendData = analyticsService.getGrowthTrendData();
    this.planDistributionData = analyticsService.getPlanDistributionData();
  }

  generateInsight(): void {
    if (this.insightForm.invalid) {
      this.insightForm.markAllAsTouched();
      return;
    }

    this.isGenerating = true;
    this.analyticsService
      .generateInsight(this.insightForm.getRawValue().query)
      .pipe(finalize(() => (this.isGenerating = false)))
      .subscribe((response) => {
        this.insightResponse = response;
      });
  }
}
