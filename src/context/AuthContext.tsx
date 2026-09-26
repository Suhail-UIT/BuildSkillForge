import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, StudentProfile, BusinessProfile, SkillPassport } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'STUDENT' | 'BUSINESS' | 'ADMIN' | null;
  studentProfile: StudentProfile | null;
  businessProfile: BusinessProfile | null;
  skillPassport: SkillPassport | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  demoLogin: (demoKey: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bsf_token'));
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [skillPassport, setSkillPassport] = useState<SkillPassport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('bsf_token');
      if (!storedToken) {
        setUser(null);
        setStudentProfile(null);
        setBusinessProfile(null);
        setSkillPassport(null);
        setIsLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setStudentProfile(res.studentProfile || null);
        setBusinessProfile(res.businessProfile || null);
        setSkillPassport(res.skillPassport || null);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('bsf_token', res.token);
        setToken(res.token);
        await refreshUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      if (res.success && res.token) {
        localStorage.setItem('bsf_token', res.token);
        setToken(res.token);
        await refreshUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (demoKey: string) => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(demoKey);
      if (res.success && res.token) {
        localStorage.setItem('bsf_token', res.token);
        setToken(res.token);
        await refreshUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bsf_token');
    setToken(null);
    setUser(null);
    setStudentProfile(null);
    setBusinessProfile(null);
    setSkillPassport(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        studentProfile,
        businessProfile,
        skillPassport,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
