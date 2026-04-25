import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedBarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { ChartCardComponent } from './components/charts/chart-card/chart-card.component';
import { SharedLineChartComponent } from './components/charts/line-chart/line-chart.component';
import { SharedPieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { EmptyStateComponent } from './components/ui/empty-state/empty-state.component';
import { SkeletonBlockComponent } from './components/loaders/skeleton-block/skeleton-block.component';
import { PageShellComponent } from './components/ui/page-shell/page-shell.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { HasRoleDirective } from './directives/has-role.directive';
import { FallbackPipe } from './pipes/fallback.pipe';

@NgModule({
  declarations: [
    PageShellComponent,
    FallbackPipe,
    SkeletonBlockComponent,
    EmptyStateComponent,
    ChartCardComponent,
    SharedLineChartComponent,
    SharedBarChartComponent,
    SharedPieChartComponent,
  ],
  imports: [CommonModule, AutofocusDirective, HasRoleDirective],
  exports: [
    CommonModule,
    PageShellComponent,
    FallbackPipe,
    AutofocusDirective,
    HasRoleDirective,
    SkeletonBlockComponent,
    EmptyStateComponent,
    ChartCardComponent,
    SharedLineChartComponent,
    SharedBarChartComponent,
    SharedPieChartComponent,
  ],
})
export class SharedModule {}
