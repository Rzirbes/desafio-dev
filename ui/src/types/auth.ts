export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthenticateRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type AuthenticateResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
