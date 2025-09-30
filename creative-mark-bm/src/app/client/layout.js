"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        role="client" 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className="flex-1 overflow-auto">
          <div className="min-h-full bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
