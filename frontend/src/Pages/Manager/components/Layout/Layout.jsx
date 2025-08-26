import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  BarChartIcon,
  PackageIcon,
  DollarSignIcon,
  ShieldIcon,
  UsersIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from 'lucide-react';
import axios from 'axios';
import Logo from '/Logo.png';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: 'Manager'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true
        });

        console.log('User data in manager header:', response.data);

        if (response.data && typeof response.data === 'object') {
          setUserData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            role: response.data.role || 'Manager'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Create display name
  const displayName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || userData.lastName || 'Manager';

  const navItems = [
    { path: '/manager', label: 'Dashboard', icon: <LayoutDashboardIcon size={20} /> },
    { path: '/manager/performance', label: 'Performance', icon: <BarChartIcon size={20} /> },
    { path: '/manager/inventory', label: 'Inventory', icon: <PackageIcon size={20} /> },
    { path: '/manager/financial', label: 'Financial', icon: <DollarSignIcon size={20} /> },
    { path: '/manager/issues', label: 'Issues', icon: <ShieldIcon size={20} /> },
    { path: '/manager/workers', label: 'Workers', icon: <UsersIcon size={20} /> },
    { path: '/manager/profile', label: 'Profile', icon: <UserIcon size={20} /> },
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
      setSidebarOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <MenuIcon size={24} />
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-10 w-64 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="CocoPro Logo" className="h-6 w-auto" />
            <h1 className="text-xl font-bold text-gray-800">CocoPro</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 focus:outline-none"
          >
            <XIcon size={20} />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="px-4 py-2">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${location.pathname === item.path ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-600 hover:text-red-500 w-full px-2 py-2"
          >
            <LogOutIcon size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <UserIcon size={20} />
              </button>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {loading ? 'Loading...' : error ? 'Manager' : displayName}
                </p>
                <p className="text-xs text-gray-500">{userData.role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;