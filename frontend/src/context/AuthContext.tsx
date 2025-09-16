import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ILoggedInUser } from '../models';
import { AuthService } from '../services/authServices';

interface AuthContextType {
  user: ILoggedInUser | null;
  login: (user: ILoggedInUser | null, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<ILoggedInUser | null>(null);
  const authService = new AuthService();

  const login = (userData: ILoggedInUser | null, token: string) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
  }

  useEffect(() => {
    // Try to restore user on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      authService.loginWithToken().then((res) => {
        if (res?.user) {
          setUser(res?.user);
        } else {
          localStorage.removeItem('authToken');
        }
      });
    }
  }, [])

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}  >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};