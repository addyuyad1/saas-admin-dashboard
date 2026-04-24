import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private readonly themeService: ThemeService) {
    // Injecting the theme service here ensures persisted theme preferences
    // are applied as soon as the application bootstraps.
    void this.themeService;
  }
}
