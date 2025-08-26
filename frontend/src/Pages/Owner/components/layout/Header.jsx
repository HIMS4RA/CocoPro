import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import axios from 'axios';

export const Header = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: 'Owner'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true
        });

        console.log('User data in header:', response.data);

        if (response.data && typeof response.data === 'object') {
          setUserData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            role: response.data.role || 'Owner'
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

  // Full name display
  const fullName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || userData.lastName || 'Owner User';

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      {/* Mobile view logo */}
      <div className="md:hidden flex items-center">
        <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="ml-2 text-xl font-bold text-gray-800">CocoPro</span>
      </div>

      {/* Empty div to maintain spacing (replacing search bar) */}
      <div className="hidden md:block"></div>

      {/* User profile only */}
      <div className="flex items-center">
        {/* User Profile */}
        <div className="flex items-center">
          <UserCircle size={28} className="text-gray-700" />
          <div className="ml-2 hidden md:block">
            {loading ? (
              <div className="text-sm font-medium text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-sm font-medium text-red-500">Error</div>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-800">{fullName}</div>
                <div className="text-xs text-gray-500">{userData.role}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
