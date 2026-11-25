export type AuthView =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'session-expired'
  | 'unauthorized';

export interface UserAuthCredentials {
  email: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

