"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { AuthUser } from "@/types/auth";

type AuthContextData = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;

  login: (accessToken: string, user: AuthUser) => void;
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

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("@finance:token");
    const storedUser = localStorage.getItem("@finance:user");

    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  function login(accessToken: string, user: AuthUser) {
    localStorage.setItem("@finance:token", accessToken);
    localStorage.setItem("@finance:user", JSON.stringify(user));

    setAccessToken(accessToken);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@finance:token");
    localStorage.removeItem("@finance:user");

    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
