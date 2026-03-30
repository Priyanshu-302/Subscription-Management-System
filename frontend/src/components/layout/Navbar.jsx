import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between w-full p-4 border-b border-glassBorder bg-background/80 backdrop-blur-md">
      <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
        <Menu size={24} />
      </button>

      <div className="flex items-center space-x-6">
        <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/profile" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 font-semibold text-white bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-300 hidden md:block">{user?.name || 'User'}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
