import type {
  AuthenticateRequest,
  AuthenticateResponse,
  AuthUser,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import { clientFetcher } from "../clientFetcher";

export const authService = {
  authenticate(data: AuthenticateRequest) {
    return clientFetcher<AuthenticateResponse>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register(data: RegisterRequest) {
    return clientFetcher<RegisterResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile(token: string) {
    return clientFetcher<AuthUser>("/auth/profile", {
      token,
    });
  },

  logout(token: string) {
    return clientFetcher<void>("/auth/logout", {
      method: "POST",
      token,
    });
  },

  refreshToken(refreshToken: string) {
    return clientFetcher<RefreshTokenResponse>("/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
