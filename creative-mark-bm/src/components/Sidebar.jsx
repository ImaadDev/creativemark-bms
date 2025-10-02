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
          w-64 sm:w-72 bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full shadow-2xl lg:h-[calc(100vh-0.5rem)] sm:lg:h-[calc(100vh-1rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        
        {/* Header */}
        <div className="h-16 sm:h-18 lg:h-20 px-3 sm:px-4 lg:px-6 flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-amber-600/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10"></div>
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
          
          <div className="relative z-10 flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg ring-1 ring-white/20">
                <span className="text-white font-bold text-xs sm:text-sm lg:text-base xl:text-xl">CM</span>
              </div>
              <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm lg:text-base xl:text-xl font-bold text-white">Creative Mark</h1>
              <p className="text-xs sm:text-xs lg:text-sm xl:text-base text-amber-100 uppercase tracking-wider font-medium capitalize">{role} Portal</p>
            </div>
          </div>
        </div>

        

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 lg:px-4 py-3 sm:py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1 sm:space-y-2">
            {links[role]?.map((link, index) => {
              const IconComponent = getIcon(link.icon);
              const isActive = isActiveLink(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center px-2 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm' 
                      : 'text-white/85 hover:bg-white/10 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  {/* Active indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1 sm:w-1.5 h-6 sm:h-8 bg-white rounded-r-full transition-all duration-300 shadow-sm
                    ${isActive ? 'opacity-100' : 'opacity-0'}
                  `}></div>
                  
                  <div className={`
                    flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg mr-3 sm:mr-4 transition-all duration-200 shadow-sm
                    ${isActive 
                      ? 'bg-white/25 text-white shadow-md' 
                      : 'bg-white/10 text-white/80 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-md'
                    }
                  `}>
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  
                  <span className="flex-1 font-medium text-xs sm:text-sm">{link.name}</span>
                  
                  {/* Badge */}
                  {link.badge && (
                    <span className={`
                      ml-2 sm:ml-3 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold rounded-full shadow-sm
                      ${isActive 
                        ? 'bg-amber-200 text-amber-800 shadow-md' 
                        : 'bg-white/20 text-white/90 group-hover:bg-white/30'
                      }
                    `}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

       

        {/* User Profile */}
        <div className="p-1 sm:p-2 border-t border-white/20">
          <div className="flex items-center justify-between p-2 sm:p-2.5 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  {loading || refreshing ? (
                    <FaSpinner className="text-white text-xs sm:text-sm animate-spin" />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name
                        ? (currentUser?.fullName || currentUser?.name || user?.fullName || user?.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : 'U'
                      }
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {loading || refreshing ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <FaSpinner className="animate-spin h-2 w-2 sm:h-3 sm:w-3" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  ) : (
                    currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                  )}
                </div>
                <p className="text-xs text-white/85 capitalize font-medium">
                  {currentUser?.role || user?.role || role || 'User'}
                </p>
                {(currentUser?.email || user?.email) && (
                  <p className="text-xs text-white/70 truncate hidden sm:block">
                    {currentUser?.email || user?.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={refreshUserData}
                disabled={refreshing}
                className="p-1.5 sm:p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
                title="Refresh Profile"
              >
                {refreshing ? (
                  <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>
           
            </div>
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