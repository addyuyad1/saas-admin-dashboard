import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SettingsSection } from '../../models/settings-section.model';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  readonly sections: SettingsSection[];

  constructor(private readonly settingsService: SettingsService) {
    this.sections = settingsService.getSections();
  }
}
