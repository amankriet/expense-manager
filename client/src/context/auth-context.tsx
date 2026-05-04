import { useState } from "react";
import { AuthContext } from "./auth-context-values";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );

  const signin = (newToken: string, cb?: VoidFunction) => {
    setToken(newToken);
    localStorage.setItem("accessToken", newToken);
    cb?.();
  };

  const signout = (cb?: VoidFunction) => {
    setToken(null);
    localStorage.removeItem("accessToken");
    cb?.();
  };

  const value = { token, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
