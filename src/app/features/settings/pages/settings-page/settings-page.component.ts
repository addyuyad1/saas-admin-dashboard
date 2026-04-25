import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { ThemeMode } from '../../../../core/services/theme.service';
import {
  SettingsSection,
  UserPreferences,
} from '../../models/settings-section.model';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly sections: SettingsSection[];
  readonly preferences$: Observable<UserPreferences>;
  readonly themes: ThemeMode[] = ['light', 'dark'];
  readonly isAdmin: boolean;

  isSaving = false;
  savedMessage = '';

  readonly preferencesForm = this.formBuilder.nonNullable.group({
    theme: ['light' as ThemeMode, [Validators.required]],
    compactMode: [false],
    emailDigest: [true],
    aiAssist: [true],
    timezone: ['Asia/Calcutta', [Validators.required]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly settingsService: SettingsService,
  ) {
    this.sections = settingsService.getSections();
    this.preferences$ = settingsService.preferences$;
    this.isAdmin = authService.getCurrentRole() === 'admin';

    this.preferencesForm.patchValue(this.settingsService.getPreferences(), {
      emitEvent: false,
    });
  }

  ngOnInit(): void {
    this.preferences$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((preferences) => {
        this.preferencesForm.patchValue(preferences, { emitEvent: false });
        this.changeDetectorRef.markForCheck();
      });
  }

  savePreferences(): void {
    const preferences = this.preferencesForm.getRawValue() as UserPreferences;
    this.isSaving = true;
    this.savedMessage = '';

    this.settingsService
      .savePreferences(preferences)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe(() => {
        this.savedMessage = 'Preferences saved successfully.';
        this.changeDetectorRef.markForCheck();
      });
  }
}
