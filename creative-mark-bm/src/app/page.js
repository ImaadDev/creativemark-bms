"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/auth";
import Image from "next/image";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex relative overflow-hidden">
     

      {/* Left Side - Animated Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden bg-gradient-to-br from-[#242021] via-[#2a2422] to-[#242021]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#ffd17a]/10 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-[#ffd17a]/20 animate-bounce delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#ffd17a]/5 animate-pulse delay-700"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 h-full p-8 transform rotate-12">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-[#ffd17a]/20 animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center text-white max-w-md">
            <div className="mb-8 animate-bounce">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#ffd17a]/20 rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src="/CreativeMarkFavicon.png" 
                  alt="CreativeMark Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 animate-fade-in text-white">
              Welcome Back
            </h1>
            <p className="text-xl text-[#ffd17a] mb-8 animate-fade-in delay-300">
              Sign in to your account and continue your journey with us
            </p>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="text-center animate-fade-in delay-500 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-2 text-[#ffd17a]">10K+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div className="text-center animate-fade-in delay-700 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-2 text-[#ffd17a]">99.9%</div>
                <div className="text-sm text-white/80">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="#ffd17a" fillOpacity="0.1">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" 
                values="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z;M0,60 C300,0 900,120 1200,60 L1200,120 L0,120 Z;M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"/>
            </path>
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 lg:p-0">
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 lg:p-10 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gradient-to-br from-[#242021] to-[#2a2422] rounded-xl sm:rounded-2xl shadow-lg animate-bounce">
                <img 
                  src="/CreativeMarkFavicon.png" 
                  alt="CreativeMark Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Sign In</h2>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back! Please sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-red-800">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-6">
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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#242021] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-4 h-4 border-gray-300 rounded focus:ring-[#ffd17a]/20 focus:ring-2"
                      style={{accentColor: '#ffd17a'}}
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm font-semibold text-[#242021] hover:text-[#242021]/80 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 sm:py-4 text-sm sm:text-base font-bold uppercase tracking-wide transition-all duration-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md ${
                    isLoading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-[#242021] text-white hover:bg-[#242021]/90 focus:outline-none focus:ring-4 focus:ring-[#ffd17a]/20"
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
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/50">
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="font-semibold text-[#242021] hover:text-[#242021]/80 hover:underline transition-colors"
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