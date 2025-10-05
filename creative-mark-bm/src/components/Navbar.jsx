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
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>

          {/* Breadcrumb/Title */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full"
                   style={{
                     backgroundColor: 'rgba(255, 209, 122, 0.1)',
                     border: '1px solid rgba(255, 209, 122, 0.2)'
                   }}>
                <span className="text-sm font-medium" style={{ color: '#ffd17a' }}>Dashboard</span>
                <span className="text-sm" style={{ color: 'rgba(255, 209, 122, 0.6)' }}>/</span>
                <span className="text-sm" style={{ color: 'rgba(255, 209, 122, 0.8)' }}>Overview</span>
              </div>
            </div>
            {/* Mobile title when sidebar is closed */}
            <div className="sm:hidden flex items-center space-x-2 px-3 py-1.5 rounded-full"
                 style={{
                   backgroundColor: 'rgba(255, 209, 122, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.2)'
                 }}>
              <span className="text-sm font-medium" style={{ color: '#ffd17a' }}>Creative Mark</span>
            </div>
          </div>
        </div>

      

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Notifications */}

          {/* Help - Only visible for clients */}
          {currentUser && currentUser.role === 'client' && (
            <button
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative group hover:bg-white/10 hover:scale-105"
              style={{ color: '#ffd17a' }}
            >
              <FaQuestionCircle className="h-5 w-5" />
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-50">
                Help & Support
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </button>
          )}


        

          {/* Divider - Hidden on small screens */}
          <div className="hidden sm:block h-6 w-px mx-2" style={{ backgroundColor: 'rgba(255, 209, 122, 0.2)' }}></div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-3 transition-all duration-300 rounded-xl hover:bg-white/10 hover:scale-105"
              style={{ color: '#ffd17a' }}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden transition-all duration-300 hover:scale-105"
                       style={{
                         background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                         boxShadow: '0 4px 12px rgba(255, 209, 122, 0.3)'
                       }}>
                    {loading || refreshing ? (
                      <FaSpinner className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" style={{ color: '#242021' }} />
                    ) : currentUser?.profilePicture ? (
                      <img
                        src={currentUser.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {(!currentUser?.profilePicture || loading || refreshing) && (
                      <FaUser className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#242021' }} />
                    )}
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold leading-none" style={{ color: '#ffd17a' }}>
                    {loading || refreshing ? (
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="animate-spin h-3 w-3" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                    )}
                  </div>
                  <p className="text-xs leading-none mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {currentUser?.role || user?.role || 'User'}
                  </p>
                </div>
                <FaChevronDown className={`hidden sm:block h-4 w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-4 w-72 bg-white border-0 shadow-2xl rounded-2xl z-20 overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                       border: '1px solid rgba(255, 209, 122, 0.1)'
                     }}>
                  <div className="p-6 border-b" style={{
                    background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                    borderBottomColor: 'rgba(36, 32, 33, 0.1)'
                  }}>
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl overflow-hidden transition-all duration-300 hover:scale-105"
                           style={{
                             background: 'linear-gradient(135deg, #242021 0%, #2a2422 100%)',
                             boxShadow: '0 8px 20px rgba(36, 32, 33, 0.3)'
                           }}>
                        {loading || refreshing ? (
                          <FaSpinner className="h-5 w-5 animate-spin" style={{ color: '#ffd17a' }} />
                        ) : currentUser?.profilePicture ? (
                          <img
                            src={currentUser.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {(!currentUser?.profilePicture || loading || refreshing) && (
                          <FaUser className="h-5 w-5" style={{ color: '#ffd17a' }} />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold" style={{ color: '#242021' }}>
                          {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'}
                        </p>
                        <p className="text-sm" style={{ color: 'rgba(36, 32, 33, 0.7)' }}>
                          {currentUser?.email || user?.email || 'user@example.com'}
                        </p>
                        <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'rgba(36, 32, 33, 0.8)' }}>
                          {currentUser?.role || user?.role || 'User'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-4 space-y-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        const userRole = currentUser?.role || user?.role || 'client';
                        const rolePath = userRole === 'admin' ? 'admin' : userRole === 'partner' ? 'partner' : userRole;
                        router.push(`/${rolePath}/profile`);
                      }}
                      className="flex items-center w-full px-5 py-4 text-sm font-semibold text-gray-800 hover:bg-white hover:shadow-md transition-all duration-300 rounded-xl mx-3 group"
                      style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
                    >
                      <div className="p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                           style={{
                             background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                             boxShadow: '0 4px 12px rgba(255, 209, 122, 0.3)'
                           }}>
                        <FaUser className="h-5 w-5" style={{ color: '#242021' }} />
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
                      className="flex items-center w-full px-5 py-4 text-sm font-semibold text-gray-800 hover:bg-white hover:shadow-md transition-all duration-300 rounded-xl mx-3 group"
                      style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
                    >
                      <div className="p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                           style={{
                             background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                             boxShadow: '0 4px 12px rgba(255, 209, 122, 0.3)'
                           }}>
                        <FaCog className="h-5 w-5" style={{ color: '#242021' }} />
                      </div>
                      Account Settings
                    </button>

                    <button
                      onClick={refreshUserData}
                      disabled={refreshing}
                      className="flex items-center w-full px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 rounded-xl mx-3 group"
                      style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    >
                      <div className="p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                           style={{
                             background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                             boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                           }}>
                        {refreshing ? (
                          <FaSpinner className="h-5 w-5 animate-spin" style={{ color: 'white' }} />
                        ) : (
                          <FaUser className="h-5 w-5" style={{ color: 'white' }} />
                        )}
                      </div>
                      {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                    </button>


                    <div className="border-t mt-4 pt-4" style={{ borderTopColor: 'rgba(255, 209, 122, 0.2)' }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-4 text-sm font-semibold text-red-700 hover:bg-red-50 transition-all duration-300 rounded-xl mx-3 group"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        <div className="p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                             style={{
                               background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                               boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                             }}>
                          <FaSignOutAlt className="h-5 w-5" style={{ color: 'white' }} />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 lg:p-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 max-w-sm sm:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-[#242021] text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-[#ffd17a]/10 transform rotate-45 translate-x-16 sm:translate-x-24 lg:translate-x-32 -translate-y-16 sm:-translate-y-24 lg:-translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-[#ffd17a]/10 transform -rotate-45 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16 translate-y-8 sm:translate-y-12 lg:translate-y-16"></div>
              
              <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#ffd17a] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl">
                        <FaHeadset className="text-lg sm:text-2xl text-[#242021]" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                          Client Support Center
                        </h2>
                        <p className="text-[#ffd17a] text-sm sm:text-base lg:text-lg">
                          Get assistance with your business applications and account
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <button
                      onClick={() => setShowHelpModal(false)}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Contact Information */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaPhone className="mr-3 text-[#242021]" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <FaPhone className="text-white text-sm sm:text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Phone Support</p>
                          <p className="text-xs sm:text-sm text-gray-600">+966 50 123 4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <FaMailBulk className="text-white text-sm sm:text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Support</p>
                          <p className="text-xs sm:text-sm text-gray-600">support@creativemark.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <FaClock className="text-white text-sm sm:text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Business Hours</p>
                          <p className="text-xs sm:text-sm text-gray-600">Sun-Thu: 8:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaFileAlt className="mr-3 text-[#242021]" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-[#ffd17a]/10 transition-all duration-200 border border-gray-200 hover:border-[#ffd17a]/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">Submit Support Ticket</span>
                          <FaChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-[#ffd17a]/10 transition-all duration-200 border border-gray-200 hover:border-[#ffd17a]/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">Application Help</span>
                          <FaChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-[#ffd17a]/10 transition-all duration-200 border border-gray-200 hover:border-[#ffd17a]/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">Download Client Guide</span>
                          <FaChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                      <button className="w-full text-left p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-[#ffd17a]/10 transition-all duration-200 border border-gray-200 hover:border-[#ffd17a]/50">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">Document Requirements</span>
                          <FaChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaQuestionCircle className="mr-3 text-[#242021]" />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">How do I submit a business application?</h4>
                        <p className="text-sm text-gray-600">Navigate to the Application page, select your service type, fill out all required information, upload necessary documents, and submit your application.</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">How can I track my application progress?</h4>
                        <p className="text-sm text-gray-600">Use the Track Application page to monitor your application status in real-time and receive updates on processing stages.</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">What documents do I need to upload?</h4>
                        <p className="text-sm text-gray-600">Document requirements vary by service type. Common documents include passport, ID card, commercial registration, and financial statements.</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">How long does application processing take?</h4>
                        <p className="text-sm text-gray-600">Processing times depend on service complexity, typically 3-15 business days. You'll receive notifications for status updates.</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Can I edit my submitted application?</h4>
                        <p className="text-sm text-gray-600">Once submitted, applications cannot be edited. Contact support if you need to make changes to your application.</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">How do I make payments for my application?</h4>
                        <p className="text-sm text-gray-600">After your application is approved, you can make payments through the Payments section in your client dashboard.</p>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaCheckCircle className="mr-3 text-[#242021]" />
                      System Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <span className="font-semibold text-gray-900">Application System</span>
                        <span className="flex items-center text-green-600 text-sm">
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <span className="font-semibold text-gray-900">Document Upload</span>
                        <span className="flex items-center text-green-600 text-sm">
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 hover:border-[#ffd17a]/50 transition-all duration-200">
                        <span className="font-semibold text-gray-900">Payment System</span>
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
              <div className="mt-4 sm:mt-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-white text-lg sm:text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Support</h3>
                    <p className="text-sm text-gray-600 mb-3">For urgent issues that require immediate attention, please contact our emergency support line.</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a href="tel:+966501234567" className="inline-flex items-center px-4 py-2 bg-[#242021] text-white rounded-lg sm:rounded-xl hover:bg-[#242021]/90 transition-all duration-200 text-sm font-medium">
                        <FaPhone className="h-4 w-4 mr-2" />
                        Call Emergency Line
                      </a>
                      <a href="mailto:emergency@creativemark.com" className="inline-flex items-center px-4 py-2 bg-[#ffd17a] text-[#242021] rounded-lg sm:rounded-xl hover:bg-[#ffd17a]/90 transition-all duration-200 text-sm font-medium">
                        <FaMailBulk className="h-4 w-4 mr-2" />
                        Email Emergency
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50/90 backdrop-blur-sm px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaInfoCircle className="h-4 w-4" />
                  <span>Need more help? Our support team is here 24/7</span>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#242021] text-white rounded-lg sm:rounded-xl hover:bg-[#242021]/90 transition-all duration-200 font-medium text-sm sm:text-base"
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