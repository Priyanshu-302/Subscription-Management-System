import { LayoutDashboard, CreditCard, Bell, Settings, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/auth.store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Profile', path: '/profile' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="relative flex flex-col h-screen border-r border-glassBorder bg-glass backdrop-blur-xl z-40 hidden md:flex"
        >
          <div className="flex items-center justify-between p-6">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                S
              </span>
              SubManager
            </h1>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-glassBorder mt-auto">
            <button
              onClick={logout}
              className="flex items-center w-full gap-3 px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
