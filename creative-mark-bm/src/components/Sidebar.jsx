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
      { name: "Documents", href: "/admin/documents", icon: "documents", badge: null },
      { name: "Employees", href: "/admin/all-employees", icon: "establishments", badge: null },
      { name: "Additional Services", href: "/admin/additional-services", icon: "additional-services", badge: null },
      { name: "Notifications", href: "/admin/notifications", icon: "notifications", badge: "8" },
    ],
    employee: [
      { name: "Dashboard", href: "/employee", icon: "dashboard", badge: null },
      { name: "My Tasks", href: "/employee/my-tasks", icon: "assigned-tasks", badge: "4" },
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
          w-72 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full shadow-2xl lg:shadow-xl
          lg:rounded-3xl lg:m-2 lg:h-[calc(100vh-1rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        
        {/* Header */}
        <div className="h-20 px-6 flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-green-600/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-600/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10 flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30">
                <span className="text-white font-bold text-sm md:text-xl">CM</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-bold text-white">Creative Mark</h1>
              <p className="text-xs md:text-base text-emerald-100 uppercase tracking-wider font-medium capitalize">{role} Portal</p>
            </div>
          </div>
        </div>

        

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {links[role]?.map((link, index) => {
              const IconComponent = getIcon(link.icon);
              const isActive = isActiveLink(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center px-2 py-2 text-sm font-semibold rounded-2xl
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'bg-white/25 text-white shadow-lg border border-white/40 backdrop-blur-sm' 
                      : 'text-white/85 hover:bg-white/15 hover:text-white hover:shadow-md'
                    }
                  `}
                >
                  {/* Active indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full transition-all duration-300 shadow-sm
                    ${isActive ? 'opacity-100' : 'opacity-0'}
                  `}></div>
                  
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-300 shadow-sm
                    ${isActive 
                      ? 'bg-white/35 text-white shadow-md' 
                      : 'bg-white/15 text-white/80 group-hover:bg-white/25 group-hover:text-white group-hover:shadow-md'
                    }
                  `}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <span className="flex-1 font-medium">{link.name}</span>
                  
                  {/* Badge */}
                  {link.badge && (
                    <span className={`
                      ml-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm
                      ${isActive 
                        ? 'bg-emerald-200 text-emerald-800 shadow-md' 
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
        <div className="p-2 border-t border-white/20">
          <div className="flex items-center justify-between p-2 bg-white/15 rounded-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {loading || refreshing ? (
                    <FaSpinner className="text-white text-sm animate-spin" />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {currentUser?.fullName || currentUser?.name || user?.fullName || user?.name
                        ? (currentUser?.fullName || currentUser?.name || user?.fullName || user?.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : 'U'
                      }
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {loading || refreshing ? (
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin h-3 w-3" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    currentUser?.fullName || currentUser?.name || user?.fullName || user?.name || 'User'
                  )}
                </div>
                <p className="text-xs text-white/85 capitalize font-medium">
                  {currentUser?.role || user?.role || role || 'User'}
                </p>
                {(currentUser?.email || user?.email) && (
                  <p className="text-xs text-white/70 truncate">
                    {currentUser?.email || user?.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={refreshUserData}
                disabled={refreshing}
                className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/15 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
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