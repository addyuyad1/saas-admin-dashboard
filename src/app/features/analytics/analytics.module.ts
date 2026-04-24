import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  declarations: [AnalyticsPageComponent],
  imports: [SharedModule, AnalyticsRoutingModule],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
