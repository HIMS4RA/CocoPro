import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  User,
  BarChart
} from 'lucide-react';
import axios from 'axios';

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/owner' },
    { id: 'financial', label: 'Financial', icon: <DollarSign size={20} />, path: '/owner/financial' },
    { id: 'strategic', label: 'Strategic', icon: <TrendingUp size={20} />, path: '/owner/strategic' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/owner/users' },
    { id: 'reports', label: 'Reports', icon: <BarChart size={20} />, path: '/owner/reports' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/owner/profile' },
  ];

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true,
      });
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 w-full md:w-64 flex-shrink-0 h-auto md:h-screen shadow-sm">
      {/* Mobile View: Horizontal Navbar */}
      <div className="md:hidden flex overflow-x-auto">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center justify-center flex-1 p-4 ${currentPath === item.path ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          >
            {item.icon}
          </Link>
        ))}
      </div>

      {/* Desktop View: Vertical Sidebar */}
      <div className="hidden md:flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">CocoPro</span>
          </Link>
          <div className="text-xs text-gray-500 mt-1">Owner Dashboard</div>
        </div>

        <nav className="flex-1 pt-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center w-full px-4 py-3 ${currentPath === item.path ? 'text-green-600 bg-green-50 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          {/*<button className="flex items-center text-gray-600 hover:text-gray-800 w-full px-4 py-2">
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </button>*/}
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-800 w-full px-4 py-2"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;