import { AuthRole } from '../auth/models/auth-session.model';

export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  title: string;
  team: string;
  plan: string;
  lastSeen: string;
  role: AuthRole;
  status: UserStatus;
}

export interface UserDraft {
  name: string;
  email: string;
  title: string;
  team: string;
  plan: string;
  role: AuthRole;
  status: UserStatus;
}
