import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Settings, Facebook, LogOut, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/conversations', icon: MessageSquare, label: 'Conversations' },
    { path: '/integration', icon: Facebook, label: 'FB Integration' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-16 bg-blue-800 flex flex-col items-center py-4">
      <div className="mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Facebook className="w-6 h-6 text-white" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative group ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="space-y-4">
        <div className="w-10 h-10 rounded-lg overflow-hidden">
          <img
            src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face`}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-200 hover:bg-blue-700 hover:text-white transition-colors relative group"
        >
          <LogOut className="w-5 h-5" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Logout
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;