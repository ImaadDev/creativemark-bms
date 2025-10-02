// Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { getCurrentUser } from "../services/auth";
import { 
  FaTachometerAlt, 
  FaFileAlt, 
  FaUsers, 
  FaTasks, 
  FaPlus,
  FaUpload,
  FaChartBar,
  FaHeadset,
  FaBell,
  FaCreditCard,
  FaBuilding,
  FaUserTie,
  FaClipboardList,
  FaCog,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaSpinner,
  FaUserCircle,
  FaUser
} from "react-icons/fa";

export default function Sidebar({ role, isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
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

  const getIcon = (iconName) => {
    const icons = {
      dashboard: FaTachometerAlt,
      requests: FaFileAlt,
      clients: FaUsers,
      tasks: FaTasks,
      'additional-services': FaPlus,
      uploads: FaUpload,
      communications: FaChartBar,
      reports: FaChartBar,
      support: FaHeadset,
      notifications: FaBell,
      payments: FaCreditCard,
      documents: FaFileAlt,
      establishments: FaBuilding,
      'assigned-tasks': FaClipboardList,
      applications: FaFileAlt,
      communication: FaFileAlt,
      profile: FaUserTie
    };
    return icons[iconName] || FaFileAlt;
  };

  const links = {
    client: [
      { name: "Dashboard", href: "/client", icon: "dashboard", badge: null },
      { name: "Application", href: "/client/application", icon: "requests", badge: null },
      { name: "Track Application", href: "/client/track-application", icon: "requests", badge: "3" },
      { name: "Additional Services", href: "/client/additional-services", icon: "additional-services", badge: null },
      { name: "Payments", href: "/client/payments", icon: "payments", badge: null },
      { name: "Support", href: "/client/support", icon: "support", badge: "2" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin", icon: "dashboard", badge: null },
      { name: "All Application", href: "/admin/requests", icon: "requests", badge: "12" },
      { name: "Reports", href: "/admin/reports", icon: "reports", badge: null },
      { name: "Clients", href: "/admin/clients", icon: "clients", badge: null },
      { name: "Add User", href: "/admin/add-user", icon: "profile", badge: null },
      { name: "Tasks", href: "/admin/tasks", icon: "tasks", badge: "5" },
      { name: "Employees", href: "/admin/all-employees", icon: "establishments", badge: null },
    ],
    employee: [
      { name: "Dashboard", href: "/employee", icon: "dashboard", badge: null },
      { name: "My Tasks", href: "/employee/my-tasks", icon: "assigned-tasks", badge: "4" },
      { name: "Assigned Applications", href: "/employee/assign-tasks", icon: "applications", badge: "2" },
      { name: "Client Support", href: "/employee/support", icon: "support", badge: "5" },
      { name: "Reports", href: "/employee/reports", icon: "reports", badge: null },
      { name: "Additional Services", href: "/employee/additional-services", icon: "additional-services", badge: null },
      { name: "Notifications", href: "/employee/notifications", icon: "notifications", badge: "3" },
    ],
    partner: [
      { name: "Dashboard", href: "/partner", icon: "dashboard", badge: null },
      { name: "Assigned Tasks", href: "/partner/assigned-tasks", icon: "assigned-tasks", badge: "2" },
      { name: "Uploads", href: "/partner/uploads", icon: "uploads", badge: null },
      { name: "Communication", href: "/partner/communication", icon: "communication", badge: "1" },
      { name: "Reports", href: "/partner/reports", icon: "reports", badge: null },
      { name: "Notifications", href: "/partner/notifications", icon: "notifications", badge: "5" },
    ],
  };

  const isActiveLink = (href) => {
    if (href === `/${role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 hide-scrollbar
          w-72
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full shadow-2xl shadow-black/20
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} style={{
          background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
          borderRight: '1px solid rgba(255, 209, 122, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
        
        {/* Header */}
        <div className="h-18 px-6 flex items-center border-b backdrop-blur-md" style={{
          borderBottomColor: 'rgba(255, 209, 122, 0.2)',
          background: 'linear-gradient(135deg, rgba(36, 32, 33, 0.9) 0%, rgba(42, 36, 34, 0.8) 100%)'
        }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105" style={{
              background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
              boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)',
              borderRadius: '14px'
            }}>
              <span className="font-bold text-lg" style={{ color: '#242021' }}>CM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: '#ffd17a' }}>Creative Mark</h1>
              <p className="text-sm text-gray-300 uppercase tracking-wider font-semibold">{role} Portal</p>
            </div>
          </div>
        </div>

        

        {/* Navigation */}
        <nav className="flex-1 px-5 py-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {links[role]?.map((link, index) => {
              const IconComponent = getIcon(link.icon);
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center px-5 py-4 text-sm font-semibold
                    transition-all duration-300 ease-out
                    ${isActive
                      ? 'shadow-xl backdrop-blur-sm'
                      : 'hover:bg-white/8 hover:shadow-lg hover:translate-x-2 hover:scale-[1.02]'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 209, 122, 0.2)' : 'transparent',
                    color: isActive ? '#ffd17a' : '#ffd17a',
                    borderRadius: '16px',
                    border: isActive ? '1px solid rgba(255, 209, 122, 0.4)' : '1px solid transparent'
                  }}
                >
                  {/* Active indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 transition-all duration-300
                    ${isActive ? 'opacity-100 shadow-xl' : 'opacity-0'}
                  `} style={{
                    background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                    borderRadius: '0 6px 6px 0',
                    boxShadow: '0 0 12px rgba(255, 209, 122, 0.5)'
                  }}></div>

                  <div className={`
                    flex items-center justify-center w-10 h-10 mr-5 transition-all duration-300 shadow-md
                  `} style={{
                    backgroundColor: isActive ? 'rgba(36, 32, 33, 0.9)' : 'rgba(255, 209, 122, 0.15)',
                    color: isActive ? '#ffd17a' : '#ffd17a',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: isActive ? '1px solid rgba(255, 209, 122, 0.3)' : '1px solid rgba(255, 209, 122, 0.1)'
                  }}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="flex-1 font-semibold tracking-wide">{link.name}</span>

                  {/* Badge */}
                  {link.badge && (
                    <span className="ml-4 px-3 py-1.5 text-xs font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                        color: '#242021',
                        borderRadius: '20px',
                        boxShadow: '0 4px 12px rgba(255, 209, 122, 0.4)',
                        border: '1px solid rgba(36, 32, 33, 0.1)'
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

       

        {/* User Profile */}
        <div className="p-5 border-t" style={{ borderTopColor: 'rgba(255, 209, 122, 0.2)' }}>
          <div className="flex items-center space-x-4 p-4 transition-all duration-300 hover:shadow-xl hover:translate-x-2 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 209, 122, 0.12) 0%, rgba(255, 209, 122, 0.06) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 209, 122, 0.15)'
            }}
          >
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110" style={{
                background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                borderRadius: '14px',
                boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                {loading || refreshing ? (
                  <FaSpinner className="text-lg animate-spin" style={{ color: '#242021' }} />
                ) : (
                  <span className="text-base font-bold" style={{ color: '#242021' }}>
                    {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name
                      ? (currentUser?.fullName || currentUser?.name || user?.fullName || user?.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'U'
                    }
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-3 border-white rounded-full shadow-md animate-pulse"
                style={{ backgroundColor: '#ffd17a' }}></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold truncate" style={{ color: '#ffd17a' }}>
                {loading || refreshing ? (
                  <div className="flex items-center space-x-2">
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                )}
              </div>
              <p className="text-sm text-gray-300 capitalize font-semibold">
                {currentUser?.role || user?.role || role || 'User'}
              </p>
            </div>
            <button
              onClick={refreshUserData}
              disabled={refreshing}
              className="p-3 transition-all duration-300 disabled:opacity-50 hover:bg-white/10 hover:scale-105"
              style={{
                color: '#ffd17a',
                backgroundColor: 'transparent',
                borderRadius: '10px'
              }}
              title="Refresh Profile"
            >
              {refreshing ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </>
  );
}