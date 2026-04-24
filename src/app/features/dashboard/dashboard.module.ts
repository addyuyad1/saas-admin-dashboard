import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [SharedModule, DashboardRoutingModule],
  providers: [DashboardService],
})
export class DashboardModule {}
