import { createContext } from "react";
import type { AuthUser } from "../types/auth";

export type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  signin: (token: string, user: AuthUser, cb?: VoidFunction) => void;
  signout: (cb?: VoidFunction) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
