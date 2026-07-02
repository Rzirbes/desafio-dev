import type {
  AuthenticateRequest,
  AuthenticateResponse,
  AuthUser,
  RegisterRequest,
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
    return clientFetcher<AuthenticateResponse>("/auth/register", {
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
};
