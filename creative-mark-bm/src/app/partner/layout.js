// External-specific layout
// /src/app/external/layout.jsx
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function ExternalLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="external" />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
