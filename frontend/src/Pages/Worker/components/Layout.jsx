import React, { useState } from 'react';
import { Link, useLocation, Outlet} from 'react-router-dom';
import {
  LayoutDashboardIcon,
  LineChartIcon,
  SlidersIcon,
  BellIcon,
  UserIcon,
  CloudSun,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from 'lucide-react';
import axios from 'axios';
import Logo from '/Logo.png';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/worker', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-5 w-5" /> },
    { path: '/worker/monitoring', label: 'Monitoring', icon: <LineChartIcon className="h-5 w-5" /> },
    { path: '/worker/controls', label: 'Controls', icon: <SlidersIcon className="h-5 w-5" /> },
    { path: '/worker/notifications', label: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { path: '/worker/profile', label: 'Profile', icon: <UserIcon className="h-5 w-5" /> },
    { path: '/worker/WeatherDashboard', label: 'Weather', icon: <CloudSun className="h-5 w-5" /> },
    //{ path: '/worker/work-logs', label: 'work-logs', icon: <CloudSun className="h-5 w-5" /> },
  ];

  // Logout handler for worker
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
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-white shadow-sm">
          {sidebarOpen ? <XIcon className="h-6 w-6 text-gray-600" /> : <MenuIcon className="h-6 w-6 text-gray-600" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={Logo} alt="CocoPro Logo" className="h-6 w-auto mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">CocoPro</h1>
                <p className="text-xs text-gray-500">Processing System</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 pt-4 pb-4">
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 ${
                      location.pathname === item.path ? 'bg-green-50 text-green-700 border-r-4 border-green-600' : ''
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <BellIcon className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
         
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">{children}<Outlet/></main>
        
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
     
    </div>
    
  );
};

export default Layout;