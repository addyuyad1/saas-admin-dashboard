import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsService } from './services/settings.service';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [SharedModule, ReactiveFormsModule, SettingsRoutingModule],
  providers: [SettingsService],
})
export class SettingsModule {}
