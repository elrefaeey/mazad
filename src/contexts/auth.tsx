import { createContext, useState, useContext, ReactNode } from "react";
import { Api } from "../services/api";
import { Admin, LoginRequest, LoginResponse } from "../types";

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await Api.post<LoginResponse>(
        "/admin/login",
        credentials
      );
      const { access_token, admin: adminData } = response.data;

      setToken(access_token);
      setAdmin(adminData);

      localStorage.setItem("token", access_token);
      localStorage.setItem("admin", JSON.stringify(adminData));

      window.location.href = "/admin/auctions";
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  const isAuthenticated = !!token && !!admin;

  const value: AuthContextType = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
