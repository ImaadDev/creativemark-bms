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
          flex flex-col h-full shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} style={{ backgroundColor: '#242021' }}>
        
        {/* Header */}
        <div className="h-16 px-4 flex items-center border-b" style={{ borderBottomColor: 'rgba(255, 209, 122, 0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
              <span className="font-bold text-sm" style={{ color: '#242021' }}>CM</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: '#ffd17a' }}>Creative Mark</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{role}</p>
            </div>
          </div>
        </div>

        

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {links[role]?.map((link, index) => {
              const IconComponent = getIcon(link.icon);
              const isActive = isActiveLink(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center px-3 py-2.5 text-sm font-medium
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'shadow-sm' 
                      : 'hover:bg-opacity-10'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? '#ffd17a' : 'transparent',
                    color: isActive ? '#242021' : '#ffd17a'
                  }}
                >
                  {/* Active indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 transition-all duration-300
                    ${isActive ? 'opacity-100' : 'opacity-0'}
                  `} style={{ backgroundColor: '#242021' }}></div>
                  
                  <div className={`
                    flex items-center justify-center w-8 h-8 mr-3 transition-all duration-200
                  `} style={{
                    backgroundColor: isActive ? '#242021' : 'rgba(255, 209, 122, 0.1)',
                    color: isActive ? '#ffd17a' : '#ffd17a'
                  }}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <span className="flex-1">{link.name}</span>
                  
                  {/* Badge */}
                  {link.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold"
                      style={{
                        backgroundColor: isActive ? '#242021' : 'rgba(255, 209, 122, 0.2)',
                        color: isActive ? '#ffd17a' : '#ffd17a'
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
        <div className="p-3 border-t" style={{ borderTopColor: 'rgba(255, 209, 122, 0.1)' }}>
          <div className="flex items-center space-x-3 p-2 transition-all duration-200"
            style={{ backgroundColor: 'rgba(255, 209, 122, 0.05)' }}
          >
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
              {loading || refreshing ? (
                <FaSpinner className="text-sm animate-spin" style={{ color: '#242021' }} />
              ) : (
                <span className="text-xs font-bold" style={{ color: '#242021' }}>
                  {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name
                    ? (currentUser?.fullName || currentUser?.name || user?.fullName || user?.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'U'
                  }
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: '#ffd17a' }}>
                {loading || refreshing ? (
                  <div className="flex items-center space-x-2">
                    <FaSpinner className="animate-spin h-3 w-3" />
                    <span className="text-xs">Loading...</span>
                  </div>
                ) : (
                  currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                )}
              </div>
              <p className="text-xs text-gray-400 capitalize">
                {currentUser?.role || user?.role || role || 'User'}
              </p>
            </div>
            <button 
              onClick={refreshUserData}
              disabled={refreshing}
              className="p-1.5 transition-all duration-200 disabled:opacity-50"
              style={{ 
                color: '#ffd17a',
                backgroundColor: 'transparent'
              }}
              title="Refresh Profile"
            >
              {refreshing ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaUser className="w-4 h-4" />
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