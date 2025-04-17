import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../PageHeader';
import { 
  UserCircleIcon, 
  BellIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Settings = ({ userData, onLogout }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow divide-y">
        {/* Profile Section */}
        <div className="p-6">
          <div className="flex items-center">
            <UserIcon className="w-6 h-6 text-gray-400" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Profile</h3>
          </div>
          <div className="mt-4 space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{userData.fullName || 'Not set'}</p>
          </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="p-6">
          <div className="flex items-center">
            <BellIcon className="w-6 h-6 text-gray-400" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
                <input 
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <span className="ml-3 text-sm text-gray-700">
                Enable email notifications
              </span>
                </label>
          </div>
        </div>
        
        {/* Appearance Section */}
        <div className="p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Appearance</h3>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              <span className="ml-3 text-sm text-gray-700">
                Enable dark mode
              </span>
                  </label>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="p-6">
          <button
            onClick={onLogout}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            <span className="ml-3 text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 