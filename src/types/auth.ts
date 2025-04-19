export interface User {
  id: string;
  email: string;
  name?: string;
  provider?: "email" | "google";
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export type SocialProvider = "google";

export type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/user-disabled"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/email-already-in-use"
  | "auth/weak-password"
  | "auth/operation-not-allowed"
  | "auth/account-exists-with-different-credential"
  | "auth/invalid-credential"
  | "auth/operation-not-supported-in-this-environment"
  | "auth/timeout"
  | "auth/popup-blocked"
  | "auth/popup-closed-by-user"
  | "auth/network-request-failed"
  | "auth/internal-error"
  | "auth/cancelled-popup-request"
  | "auth/unauthorized-domain"
  | string;

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  logout: () => void;
}
