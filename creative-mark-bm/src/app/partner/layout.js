// Partner-specific layout
"use client";
import { useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function PartnerLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Protect partner routes - only allow partner role
  const isAuthenticated = useAuthGuard(['partner']);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Don't render the layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        role="partner" 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
