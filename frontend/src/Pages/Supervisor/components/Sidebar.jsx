import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  UsersIcon,
  AlertTriangleIcon,
  FileTextIcon,
  XIcon,
  LogOutIcon,
  UserIcon, // Added for Profile
} from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true,
      });
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
      setOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.history.replaceState(null, '', '/');
      window.location.href = 'http://localhost:5173';
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 text-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-green-700">
              CocoPro
            </span>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Main Navigation */}
        <nav className="flex-1 mt-5 px-2">
          <NavLink
            to="/supervisor"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            end
          >
            <LayoutDashboardIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/supervisor/worker-management"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <UsersIcon className="h-5 w-5 mr-3" />
            Worker Management
          </NavLink>
          <NavLink
            to="/supervisor/incident-management"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <AlertTriangleIcon className="h-5 w-5 mr-3" />
            Incident Management
          </NavLink>
          <NavLink
            to="/supervisor/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <UserIcon className="h-5 w-5 mr-3" /> {/* New icon for Profile */}
            Profile
          </NavLink>
        </nav>
        {/* Logout Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;