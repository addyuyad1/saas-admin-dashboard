import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';

@NgModule({
  declarations: [AnalyticsPageComponent],
  imports: [SharedModule, ReactiveFormsModule, AnalyticsRoutingModule],
})
export class AnalyticsModule {}
