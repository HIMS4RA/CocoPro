// src/Pages/Owner/components/layout/OwnerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const OwnerLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />  {/* This will render the child routes dynamically */}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;