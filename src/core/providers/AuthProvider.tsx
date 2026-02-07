"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kuinbee_mock_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("kuinbee_mock_user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TEMPORARY BYPASS: Accept any credentials
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          email,
          name: email.split("@")[0], // Use email prefix as name
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
        };
        setUser(mockUser);
        localStorage.setItem("kuinbee_mock_user", JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // TEMPORARY BYPASS: Accept any credentials
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          email,
          name,
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
        };
        setUser(mockUser);
        localStorage.setItem("kuinbee_mock_user", JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kuinbee_mock_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
