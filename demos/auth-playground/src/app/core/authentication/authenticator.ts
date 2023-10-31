export interface Authenticator {
  login(email?: string, password?: string): Promise<void>;
  logout(): Promise<void>;
  getAccessToken(): Promise<string | void>;
  isAuthenticated(): Promise<boolean>;
}
