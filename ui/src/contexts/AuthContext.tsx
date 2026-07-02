"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { AuthUser } from "@/types/auth";

type AuthContextData = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;

  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;

  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("@finance:token");
    const storedRefreshToken = localStorage.getItem("@finance:refreshToken");
    const storedUser = localStorage.getItem("@finance:user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  function login(accessToken: string, refreshToken: string, user: AuthUser) {
    localStorage.setItem("@finance:token", accessToken);
    localStorage.setItem("@finance:refreshToken", refreshToken);
    localStorage.setItem("@finance:user", JSON.stringify(user));

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@finance:token");
    localStorage.removeItem("@finance:refreshToken");
    localStorage.removeItem("@finance:user");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
