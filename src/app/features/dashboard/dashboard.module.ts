import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DashboardWidgetService } from './services/dashboard-widget.service';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardWidgetComponent,
    KpiCardComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
  providers: [DashboardWidgetService],
})
export class DashboardModule {}
