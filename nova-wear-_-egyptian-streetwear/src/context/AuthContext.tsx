import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types/index.js';

interface AuthContextType {
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  adminUser: { role: string; fullName: string } | null;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  customerUser: UserAccount | null;
  loginCustomer: (fullName: string, phone: string, email: string) => void;
  logoutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('nova_admin_token'));
  const [adminUser, setAdminUser] = useState<{ role: string; fullName: string } | null>(() => {
    try {
      const saved = localStorage.getItem('nova_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customerUser, setCustomerUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('nova_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('nova_admin_token', adminToken);
    } else {
      localStorage.removeItem('nova_admin_token');
    }
    if (adminUser) {
      localStorage.setItem('nova_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('nova_admin_user');
    }
  }, [adminToken, adminUser]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('nova_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('nova_customer');
    }
  }, [customerUser]);

  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
  };

  const loginCustomer = (fullName: string, phone: string, email: string) => {
    const user: UserAccount = {
      id: `cust-${Date.now()}`,
      email,
      fullName,
      phone,
      role: 'customer',
    };
    setCustomerUser(user);
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn: !!adminToken,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        customerUser,
        loginCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
