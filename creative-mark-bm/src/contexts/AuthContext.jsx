"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { login as authLogin, logout as authLogout, getCurrentUser } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Get current user info
  const getCurrentUserInfo = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error("Get current user error:", error);
      
      // If it's a network error, don't clear the stored user
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        console.warn('Backend server is not running. Using cached user data.');
        return user; // Return cached user if available
      }
      
      // For other errors (like 401), clear the stored user
      setUser(null);
      localStorage.removeItem("user");
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      getCurrentUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;