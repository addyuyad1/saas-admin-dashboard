export interface SettingsSection {
  title: string;
  description: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  compactMode: boolean;
  emailDigest: boolean;
  aiAssist: boolean;
  timezone: string;
}
