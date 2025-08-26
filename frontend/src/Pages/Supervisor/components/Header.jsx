import React, { useEffect, useState } from 'react'
import { MenuIcon, BellIcon, UserIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const Header = ({ onOpenSidebar }) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: 'Supervisor'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update page title based on current route
    const path = location.pathname;
    
    if (path === '/supervisor') {
      setPageTitle('Dashboard');
    } else if (path.includes('/worker-management')) {
      setPageTitle('Worker Management');
    } else if (path.includes('/incident-management')) {
      setPageTitle('Incident Management');
    } else if (path.includes('/profile')) {
      setPageTitle('Profile');
    } else {
      // Default for any other pages
      setPageTitle('Supervisor Portal');
    }
  }, [location]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true
        });

        console.log('User data in supervisor header:', response.data);

        if (response.data && typeof response.data === 'object') {
          setUserData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            role: response.data.role || 'Supervisor'
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
    : userData.firstName || userData.lastName || 'User';

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <button className="md:hidden" onClick={onOpenSidebar}>
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex-1 md:ml-4">
          <h1 className="text-xl font-semibold text-green-800">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-1 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center border-l pl-3 ml-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white">
                <UserIcon className="h-5 w-5" />
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">
                {loading ? 'Loading...' : error ? 'User' : displayName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
