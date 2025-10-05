// Navbar.jsx
"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, getCurrentUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
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
  FaSpinner,
  FaPhone,
  FaMailBulk,
  FaClock,
  FaHeadset,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

const notifications = [
  { id: 1, title: "New Ticket Assigned", description: "You have a new ticket from Kimad.", time: "2 min ago" },
  { id: 2, title: "Ticket Resolved", description: "Ticket #123 has been resolved.", time: "10 min ago" },
  { id: 3, title: "New Comment", description: "Emma commented on ticket #45.", time: "1 hour ago" },
];

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user: currentUser, updateUser, handleLogout: authHandleLogout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Set loading to false when user data is available from AuthContext
  useEffect(() => {
    setLoading(false);
  }, [currentUser]);

  // Listen for profile updates and refresh user data
  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshUserData();
    };

    // Listen for custom events when profile is updated
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      // User data is managed by AuthContext, no need to fetch here
      // The AuthContext will handle refreshing user data
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      // First, clear user from AuthContext to prevent authentication warnings
      authHandleLogout();
      
      // Then call the backend logout
      await logout();
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails, user is already cleared from AuthContext
      router.push('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 backdrop-blur-sm lg:rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderBottom: '1px solid rgba(255, 209, 122, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}>
        <div className="flex items-center justify-between h-18 sm:h-20 lg:h-22 px-6 sm:px-8 lg:px-12">
          
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105"
              style={{ color: '#ffd17a' }}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FaBars className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Breadcrumb/Title */}
            <div className="flex items-center space-x-3">
              {/* Mobile title when sidebar is closed */}
              {!isSidebarOpen && (
                <div className="lg:hidden">
                  <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#ffd17a' }}>
                    Creative Mark
                  </h1>
                </div>
              )}
              
              {/* Desktop breadcrumb - you can customize this based on current page */}
              <div className="hidden lg:flex items-center space-x-2 text-sm">
                <span className="text-gray-300">Dashboard</span>
                <FaChevronDown className="h-3 w-3 text-gray-400 transform -rotate-90" />
                <span className="text-[#ffd17a] font-medium">Overview</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Notifications - Only visible for clients */}
            {currentUser && currentUser.role === 'client' && (
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 relative"
                style={{ color: '#ffd17a' }}
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5 sm:h-6 sm:w-6" />
                {/* Optional: red dot for unread notifications */}
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-[#242021]"></span>
              </button>
            )}

            {/* Help - Only visible for clients */}
            {currentUser && currentUser.role === 'client' && (
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105"
                style={{ color: '#ffd17a' }}
                aria-label="Help & Support"
              >
                <FaQuestionCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            {/* Divider - Only show if user is client (has notifications/help buttons) */}
            {currentUser && currentUser.role === 'client' && (
              <div className="hidden sm:block w-px h-6 bg-gray-400/30"></div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                style={{ color: '#ffd17a' }}
              >
                {/* User Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#ffd17a]/30">
                  {currentUser?.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white font-bold text-sm sm:text-base"
                      style={{ backgroundColor: '#ffd17a', color: '#242021' }}
                    >
                      {(currentUser?.fullName || currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">
                    {currentUser?.fullName || currentUser?.name || 'User'}
                  </div>
                  <div className="text-xs opacity-80">
                    {currentUser?.role || user?.role || 'User'}
                  </div>
                </div>

                <FaChevronDown className={`h-3 w-3 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 py-4 z-30">
                  <div className="px-4 pb-3 border-b border-gray-200/50">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 w-full p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* User Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                        {currentUser?.profilePicture ? (
                          <img
                            src={currentUser.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: '#ffd17a', color: '#242021' }}
                          >
                            {(currentUser?.fullName || currentUser?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">
                          {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {currentUser?.email || user?.email || 'user@example.com'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {currentUser?.role || user?.role || 'User'}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push(`/${currentUser?.role || user?.role || 'client'}/profile`);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
                    >
                      <FaUser className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Profile Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push(`/${currentUser?.role || user?.role || 'client'}/settings`);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
                    >
                      <FaCog className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Account Settings</span>
                    </button>

                    <button
                      onClick={refreshUserData}
                      disabled={refreshing}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    >
                      {refreshing ? (
                        <FaSpinner className="h-4 w-4 text-blue-600 animate-spin" />
                      ) : (
                        <FaCalendar className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-blue-900">
                        {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                      </span>
                    </button>

                    <div className="border-t border-gray-200/50 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                    >
                      <FaSignOutAlt className="h-4 w-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal - Outside header for proper z-index */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#ffd17a] mb-1">Notifications</h2>
                  <p className="text-[#ffd17a]/70 text-sm">Stay updated with your latest updates</p>
                </div>
                <button 
                  onClick={() => setShowNotificationsModal(false)} 
                  className="text-[#ffd17a]/70 hover:text-[#ffd17a] transition-colors p-2 hover:bg-white/10 rounded-xl"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#ffd17a] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{notification.description}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal - Outside header for proper z-index */}
      {showHelpModal && currentUser && currentUser.role === 'client' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#ffd17a] mb-1">Help & Support</h2>
                  <p className="text-[#ffd17a]/70 text-sm">Get help with your account and services</p>
                </div>
                <button 
                  onClick={() => setShowHelpModal(false)} 
                  className="text-[#ffd17a]/70 hover:text-[#ffd17a] transition-colors p-2 hover:bg-white/10 rounded-xl"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#242021] mb-4">Contact Information</h3>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaPhone className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone Support</h4>
                      <p className="text-gray-600 text-sm">+966 50 123 4567</p>
                      <p className="text-gray-500 text-xs">Available 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaEnvelope className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Support</h4>
                      <p className="text-gray-600 text-sm">support@creativemark.sa</p>
                      <p className="text-gray-500 text-xs">Response within 2 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaHeadset className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      <p className="text-gray-600 text-sm">Available on website</p>
                      <p className="text-gray-500 text-xs">Mon-Fri 9AM-6PM</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#242021] mb-4">Quick Actions</h3>
                  
                  <button 
                    onClick={() => {
                      setShowHelpModal(false);
                      router.push('/client/support');
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <FaFileAlt className="text-[#ffd17a]" />
                    <div className="text-left">
                      <h4 className="font-semibold">Create Support Ticket</h4>
                      <p className="text-sm opacity-80">Get help with your issues</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowHelpModal(false);
                      router.push('/client/track-application');
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    <FaClock className="text-gray-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Track Application</h4>
                      <p className="text-sm text-gray-600">Check your application status</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowHelpModal(false);
                      router.push('/client/payments');
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    <FaCheckCircle className="text-gray-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Payment History</h4>
                      <p className="text-sm text-gray-600">View your payment records</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}