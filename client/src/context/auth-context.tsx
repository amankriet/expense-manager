import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  signin: (token: string, cb?: VoidFunction) => void;
  signout: (cb?: VoidFunction) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
