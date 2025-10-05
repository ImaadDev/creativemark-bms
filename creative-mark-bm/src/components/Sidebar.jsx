"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Image from "next/image";
import logo from "../../public/CreativeMarkFavicon.png";
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
  FaClipboardList,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

export default function Sidebar({ role, isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
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

  const links = {
    client: [
      { name: "Dashboard", href: "/client", icon: "dashboard" },
      { name: "Application", href: "/client/application", icon: "requests" },
      { name: "Track Application", href: "/client/track-application", icon: "requests", badge: "3" },
      { name: "Payments", href: "/client/payments", icon: "payments" },
      { name: "Support", href: "/client/support", icon: "support", badge: "2" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin", icon: "dashboard" },
      { name: "All Applications", href: "/admin/requests", icon: "requests", badge: "12" },
      { name: "Support Tickets", href: "/admin/tickets", icon: "support", badge: "8" },
      { name: "Reports", href: "/admin/reports", icon: "reports" },
      { name: "Clients", href: "/admin/clients", icon: "clients" },
      { name: "Add User", href: "/admin/add-user", icon: "clients" },
      { name: "Tasks", href: "/admin/tasks", icon: "tasks", badge: "5" },
      { name: "Employees", href: "/admin/all-employees", icon: "establishments" },
    ],
    employee: [
      { name: "Dashboard", href: "/employee", icon: "dashboard" },
      { name: "My Tasks", href: "/employee/my-tasks", icon: "tasks", badge: "4" },
      { name: "Assigned Applications", href: "/employee/assign-tasks", icon: "requests", badge: "2" },
      { name: "Assigned Tickets", href: "/employee/tickets", icon: "support", badge: "5" },
      { name: "Client Support", href: "/employee/support", icon: "support" },
      { name: "Reports", href: "/employee/reports", icon: "reports" },
      { name: "Additional Services", href: "/employee/additional-services", icon: "additional-services" },
      { name: "Notifications", href: "/employee/notifications", icon: "notifications", badge: "3" },
    ],
    partner: [
      { name: "Dashboard", href: "/partner", icon: "dashboard" },
      { name: "Assigned Tasks", href: "/partner/assigned-tasks", icon: "tasks", badge: "2" },
      { name: "Uploads", href: "/partner/uploads", icon: "uploads" },
      { name: "Communication", href: "/partner/communication", icon: "requests", badge: "1" },
      { name: "Reports", href: "/partner/reports", icon: "reports" },
      { name: "Notifications", href: "/partner/notifications", icon: "notifications", badge: "5" },
    ],
  };

  const getIcon = (iconName) => {
    const icons = {
      dashboard: FaTachometerAlt,
      requests: FaFileAlt,
      clients: FaUsers,
      tasks: FaTasks,
      'additional-services': FaPlus,
      uploads: FaUpload,
      reports: FaChartBar,
      support: FaHeadset,
      notifications: FaBell,
      payments: FaCreditCard,
      establishments: FaBuilding,
    };
    return icons[iconName] || FaFileAlt;
  };

  const isActiveLink = (href) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 flex flex-col h-full lg:rounded-3xl
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
          borderRight: '1px solid rgba(255, 209, 122, 0.2)',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderBottomColor: 'rgba(255, 209, 122, 0.2)' }}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center">
              <Image src={logo} alt="Creative Mark" width={60} height={60} />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: '#ffd17a' }}>Creative Mark</h1>
              <p className="text-xs uppercase text-gray-300">{role} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {links[role]?.map((link) => {
            const IconComponent = getIcon(link.icon);
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center p-3 mb-2 rounded-lg
                  ${isActive ? 'bg-[#ffd17a]/20' : 'hover:bg-[#ffd17a]/10'}
                `}
                style={{ color: '#ffd17a' }}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <span className="flex-1">{link.name}</span>
                {link.badge && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                      color: '#242021',
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t" style={{ borderTopColor: 'rgba(255, 209, 122, 0.2)' }}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)' }}
            >
              {loading ? (
                <FaSpinner className="animate-spin text-[#242021]" />
              ) : (
                <span className="font-bold text-[#242021]">
                  {(currentUser?.fullName || user?.fullName || 'User')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#ffd17a' }}>
                {loading ? 'Loading...' : (currentUser?.fullName || user?.fullName || 'User')}
              </p>
              <p className="text-xs text-gray-300 capitalize">
                {currentUser?.role || user?.role || role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}