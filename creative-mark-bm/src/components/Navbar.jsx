// Navbar.jsx
"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, getCurrentUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
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

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user: currentUser, updateUser, handleLogout: authHandleLogout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-xl sticky top-0 z-20 mx-1 sm:mx-2 mt-1 sm:mt-2 rounded-xl sm:rounded-2xl">
      <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 px-3 sm:px-4 lg:px-6 xl:px-8">
        
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FaTimes className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            ) : (
              <FaBars className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </button>

          {/* Breadcrumb/Title */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 text-white/90">
              <span className="text-xs sm:text-sm font-medium">Dashboard</span>
              <span className="text-white/60 text-xs sm:text-sm">/</span>
              <span className="text-xs sm:text-sm text-white/70">Overview</span>
            </div>
            {/* Mobile title when sidebar is closed */}
            <div className="sm:hidden text-white">
              <span className="text-xs sm:text-sm font-medium">Creative Mark</span>
            </div>
          </div>
        </div>

      

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          
      

          

          {/* Help - Only visible for clients */}
          {currentUser && currentUser.role === 'client' && (
            <button 
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:block p-2 lg:p-3 rounded-xl lg:rounded-2xl hover:bg-white/15 transition-all duration-300 relative group shadow-sm hover:shadow-md"
            >
              <FaQuestionCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white/80 group-hover:text-white" />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                Help & Support
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white/15 transition-all duration-300 relative group shadow-sm hover:shadow-md">
              <NotificationBell />
            </div>
          </div>

        

          {/* Divider - Hidden on small screens */}
          <div className="hidden sm:block h-4 sm:h-6 w-px bg-white/20 mx-1 sm:mx-2"></div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 sm:space-x-2 p-2 sm:p-3 hover:bg-white/15 transition-all duration-300 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30 overflow-hidden">
                    {loading || refreshing ? (
                      <FaSpinner className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-spin" />
                    ) : currentUser?.profilePicture ? (
                      <img
                        src={currentUser.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {(!currentUser?.profilePicture || loading || refreshing) && (
                      <FaUser className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    )}
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs sm:text-sm font-medium text-white leading-none">
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
                <FaChevronDown className={`hidden sm:block h-3 w-3 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
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
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                        {loading || refreshing ? (
                          <FaSpinner className="h-5 w-5 text-white animate-spin" />
                        ) : currentUser?.profilePicture ? (
                          <img
                            src={currentUser.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-2xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {(!currentUser?.profilePicture || loading || refreshing) && (
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
                        const rolePath = userRole === 'admin' ? 'admin' : userRole === 'partner' ? 'partner' : userRole;
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

      {/* Help & Support Modal - Only for clients */}
      {showHelpModal && currentUser && currentUser.role === 'client' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl max-w-sm sm:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 sm:p-4 lg:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl">
                    <FaHeadset className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Client Support Center</h2>
                    <p className="text-emerald-100 text-xs sm:text-sm">Get assistance with your business applications and account</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Contact Information */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaPhone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Phone Support</p>
                          <p className="text-xs sm:text-sm text-gray-600">+966 50 123 4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FaMailBulk className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Email Support</p>
                          <p className="text-xs sm:text-sm text-gray-600">support@creativemark.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FaClock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">Business Hours</p>
                          <p className="text-xs sm:text-sm text-gray-600">Sun-Thu: 8:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <FaFileAlt className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mr-2" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <button className="w-full text-left p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm sm:text-base">Submit Support Ticket</span>
                          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm sm:text-base">Application Help</span>
                          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm sm:text-base">Download Client Guide</span>
                          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm sm:text-base">Document Requirements</span>
                          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaQuestionCircle className="h-5 w-5 text-orange-600 mr-2" />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">How do I submit a business application?</h4>
                        <p className="text-sm text-gray-600">Navigate to the Application page, select your service type, fill out all required information, upload necessary documents, and submit your application.</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">How can I track my application progress?</h4>
                        <p className="text-sm text-gray-600">Use the Track Application page to monitor your application status in real-time and receive updates on processing stages.</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">What documents do I need to upload?</h4>
                        <p className="text-sm text-gray-600">Document requirements vary by service type. Common documents include passport, ID card, commercial registration, and financial statements.</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">How long does application processing take?</h4>
                        <p className="text-sm text-gray-600">Processing times depend on service complexity, typically 3-15 business days. You'll receive notifications for status updates.</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">Can I edit my submitted application?</h4>
                        <p className="text-sm text-gray-600">Once submitted, applications cannot be edited. Contact support if you need to make changes to your application.</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">How do I make payments for my application?</h4>
                        <p className="text-sm text-gray-600">After your application is approved, you can make payments through the Payments section in your client dashboard.</p>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      System Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
                        <span className="font-medium text-gray-900">Application System</span>
                        <span className="flex items-center text-green-600 text-sm">
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
                        <span className="font-medium text-gray-900">Document Upload</span>
                        <span className="flex items-center text-green-600 text-sm">
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
                        <span className="font-medium text-gray-900">Payment System</span>
                        <span className="flex items-center text-green-600 text-sm">
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-100 rounded-2xl p-6 border border-red-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Support</h3>
                    <p className="text-sm text-gray-600 mb-3">For urgent issues that require immediate attention, please contact our emergency support line.</p>
                    <div className="flex items-center space-x-4">
                      <a href="tel:+966501234567" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium">
                        <FaPhone className="h-4 w-4 mr-2" />
                        Call Emergency Line
                      </a>
                      <a href="mailto:emergency@creativemark.com" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 text-sm font-medium">
                        <FaMailBulk className="h-4 w-4 mr-2" />
                        Email Emergency
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaInfoCircle className="h-4 w-4" />
                  <span>Need more help? Our support team is here 24/7</span>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}