
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

// Mock user data for demonstration
const MOCK_USERS: Record<string, Omit<User, 'id' | 'name'>> = {
  'admin@cybersec.io': {
    email: 'admin@cybersec.io',
    roles: [UserRole.ADMIN, UserRole.ANALYST],
    createdAt: new Date().toISOString(),
    enabled: true,
  },
  'analyst@cybersec.io': {
    email: 'analyst@cybersec.io',
    roles: [UserRole.ANALYST],
    createdAt: new Date().toISOString(),
    enabled: true,
  },
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updatedInfo: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  const login = useCallback(async (email: string, role: UserRole): Promise<void> => {
    // In a real app, this would be an API call.
    // Here we simulate it with mock data.
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseUser = MOCK_USERS[email];
        let user: User;

        if (baseUser) {
           user = {
            id: `user-${Date.now()}`,
            name: email === 'admin@cybersec.io' ? 'Admin User' : 'Analyst User',
            ...baseUser,
            // Override roles based on login selection for demo purposes
            roles: role === UserRole.ADMIN ? [UserRole.ADMIN, UserRole.ANALYST] : [UserRole.ANALYST],
          };
        } else {
            // For demo, just create a new user if not found
            user = {
                id: `user-${Date.now()}`,
                name: 'New User',
                email: email,
                roles: role === UserRole.ADMIN ? [UserRole.ADMIN, UserRole.ANALYST] : [UserRole.ANALYST],
                createdAt: new Date().toISOString(),
                enabled: true,
            };
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        navigate('/dashboard');
        resolve();
      }, 500);
    });
  }, [navigate]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  }, [navigate]);

  const updateUser = useCallback(async (updatedInfo: Partial<User>): Promise<void> => {
    return new Promise((resolve) => {
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updatedInfo };
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return newUser;
        });
        resolve();
    });
  }, []);
  
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.roles.includes(UserRole.ADMIN) ?? false;

  const value = { currentUser, isAuthenticated, isAdmin, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
