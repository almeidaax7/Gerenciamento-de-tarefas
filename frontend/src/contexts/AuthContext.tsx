import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import api from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loadUser: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);