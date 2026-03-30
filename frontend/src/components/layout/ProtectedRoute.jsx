import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

const ProtectedRoute = () => {
  const { token } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay for closing the sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="w-full h-full p-6 mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
