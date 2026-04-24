export type AuthRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  roleLabel: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
