import { createContext } from "react";

export type AuthContextType = {
  token: string | null;
  signin: (token: string, cb?: VoidFunction) => void;
  signout: (cb?: VoidFunction) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
