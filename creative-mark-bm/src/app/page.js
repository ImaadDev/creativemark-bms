"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/auth";

export default function LoginPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client" // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Call backend login API
      console.log("Frontend: Attempting login with:", formData);
      const response = await login({
        email: formData.email,
        password: formData.password
      });
      
      console.log("Frontend: Login response received:", response);
      
      if (response.success) {
        console.log("Frontend: Login successful, user data:", response.user);
        console.log("Frontend: Cookies after login:", document.cookie);
        
        // Update AuthContext with user data
        updateUser(response.user);
        
        // Navigate to appropriate page
        console.log("Frontend: Navigating to role:", response.user.role);
        switch (response.user.role) {
          case 'employee':
            console.log("Frontend: Redirecting to /employee");
            router.push('/employee');
            break;
          case 'partner':
            console.log("Frontend: Redirecting to /partner");
            router.push('/partner');
            break;
          case 'admin':
            console.log("Frontend: Redirecting to /admin");
            router.push('/admin');
            break;
          case 'client':
          default:
            console.log("Frontend: Redirecting to /client");
            router.push('/client');
            break;
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex">
      {/* Left Side - Animated Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/20 animate-bounce delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-white/5 animate-pulse delay-700"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 h-full p-8 transform rotate-12">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-white/20 animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center text-white max-w-md">
            <div className="mb-8 animate-bounce">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/30"></div>
              </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 animate-fade-in">
              Welcome Back
            </h1>
            <p className="text-xl opacity-90 mb-8 animate-fade-in delay-300">
              Sign in to your account and continue your journey with us
            </p>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="text-center animate-fade-in delay-500">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-80">Active Users</div>
              </div>
              <div className="text-center animate-fade-in delay-700">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-sm opacity-80">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white" fillOpacity="0.1">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" 
                values="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z;M0,60 C300,0 900,120 1200,60 L1200,120 L0,120 Z;M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"/>
            </path>
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 lg:p-0">
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 lg:p-10 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg animate-bounce">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Welcome back! Please sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-red-800">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-emerald-300"
                  />
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-emerald-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-gray-300 rounded focus:ring-emerald-200 focus:ring-2"
                      style={{accentColor: '#10b981'}}
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 text-sm font-bold uppercase tracking-wide transition-all duration-200 rounded-lg shadow-sm hover:shadow-md ${
                    isLoading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      SIGNING IN...
                    </div>
                  ) : (
                    "SIGN IN"
                  )}
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Register Here
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}