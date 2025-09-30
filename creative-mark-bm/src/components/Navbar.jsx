// Navbar.jsx
"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../contexts/AuthContext";
import { logout, getCurrentUser } from "../services/auth";
import NotificationBell from "./notifications/NotificationBell";
import { 
  FaBell, 
  FaSearch, 
  FaUser, 
  FaCog, 
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendar,
  FaSpinner
} from "react-icons/fa";

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        if (response.success) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-xl sticky top-0 z-20 mx-2 mt-2 rounded-2xl">
      <div className="flex items-center justify-between h-20 px-6 lg:px-8">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-3 rounded-2xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FaTimes className="h-5 w-5 text-white" />
            ) : (
              <FaBars className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Breadcrumb/Title */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-white/90">
              <span className="text-sm font-medium">Dashboard</span>
              <span className="text-white/60">/</span>
              <span className="text-sm text-white/70">Overview</span>
            </div>
            {/* Mobile title when sidebar is closed */}
            <div className="sm:hidden text-white">
              <span className="text-sm font-medium">Creative Mark</span>
            </div>
          </div>
        </div>

      

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          
      

          

          {/* Help - Hidden on small screens */}
          <button className="hidden sm:block p-3 rounded-2xl hover:bg-white/15 transition-all duration-300 relative group shadow-sm hover:shadow-md">
            <FaQuestionCircle className="h-4 w-4 text-white/80 group-hover:text-white" />
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
              Help & Support
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <div className="p-3 rounded-2xl hover:bg-white/15 transition-all duration-300 relative group shadow-sm hover:shadow-md">
              <NotificationBell />
            </div>
          </div>

        

          {/* Divider - Hidden on small screens */}
          <div className="hidden sm:block h-6 w-px bg-white/20 mx-2"></div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-3 hover:bg-white/15 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-white leading-none">
                    {loading || refreshing ? (
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="animate-spin h-3 w-3" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                    )}
                  </div>
                  <p className="text-xs text-white/70 leading-none mt-0.5">
                    {currentUser?.role || user?.role || 'User'}
                  </p>
                </div>
                <FaChevronDown className={`hidden lg:block h-3 w-3 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 sm:w-72 bg-white border border-gray-100 shadow-2xl rounded-2xl z-20 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        {loading || refreshing ? (
                          <FaSpinner className="h-5 w-5 text-white animate-spin" />
                        ) : (
                          <FaUser className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {currentUser?.email || user?.email || 'user@example.com'}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {currentUser?.role || user?.role || 'User'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        const userRole = currentUser?.role || user?.role || 'client';
                        const rolePath = userRole === 'internal' ? 'admin' : userRole === 'external' ? 'partner' : userRole;
                        router.push(`/${rolePath}/profile`);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-xl mx-2"
                    >
                      <div className="p-2 rounded-xl bg-gray-100 mr-3 shadow-sm">
                        <FaUser className="h-4 w-4" />
                      </div>
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        const userRole = currentUser?.role || user?.role || 'client';
                        const rolePath = userRole === 'internal' ? 'admin' : userRole === 'external' ? 'partner' : userRole;
                        router.push(`/${rolePath}/settings`);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-xl mx-2"
                    >
                      <div className="p-2 rounded-xl bg-gray-100 mr-3 shadow-sm">
                        <FaCog className="h-4 w-4" />
                      </div>
                      Account Settings
                    </button>
                    
                    <button 
                      onClick={refreshUserData}
                      disabled={refreshing}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 rounded-xl mx-2"
                    >
                      <div className="p-2 rounded-xl bg-blue-100 mr-3 shadow-sm">
                        {refreshing ? (
                          <FaSpinner className="h-4 w-4 animate-spin" />
                        ) : (
                          <FaUser className="h-4 w-4" />
                        )}
                      </div>
                      {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl mx-2"
                      >
                        <div className="p-2 rounded-xl bg-red-100 mr-3 shadow-sm">
                          <FaSignOutAlt className="h-4 w-4" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}