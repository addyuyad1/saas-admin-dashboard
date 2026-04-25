import { AuthRole } from '../../../core/auth/models/auth-session.model';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  title: string;
  team: string;
  plan: string;
  lastSeen: string;
  role: AuthRole;
  status: 'Active' | 'Invited' | 'Suspended';
}

export interface UserDraft {
  name: string;
  email: string;
  title: string;
  team: string;
  plan: string;
  role: AuthRole;
  status: 'Active' | 'Invited' | 'Suspended';
}
