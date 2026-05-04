import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth-context-values";
import type { AuthUser } from "../types/auth";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const signin = (newToken: string, authUser: AuthUser, cb?: VoidFunction) => {
    setToken(newToken);
    setUser(authUser);
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("user", JSON.stringify(authUser));
    cb?.();
  };

  const signout = (cb?: VoidFunction) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    cb?.();
  };

  const value = { token, user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
