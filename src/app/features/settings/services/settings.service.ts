import { Injectable } from '@angular/core';

import { SettingsSection } from '../models/settings-section.model';

@Injectable()
export class SettingsService {
  getSections(): SettingsSection[] {
    return [
      {
        title: 'Workspace branding',
        description: 'Manage logos, colors, and white-label defaults.',
      },
      {
        title: 'Security policies',
        description: 'Centralize roles, session policies, and audit controls.',
      },
      {
        title: 'Billing operations',
        description: 'Configure invoicing, taxes, and finance notifications.',
      },
    ];
  }
}
