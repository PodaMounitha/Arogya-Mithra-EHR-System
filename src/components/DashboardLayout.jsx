import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { SunIcon, MoonIcon, BellIcon } from '@heroicons/react/24/outline';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

export default function DashboardLayout({ children, title }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Get user data from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Load sample notifications - in a real app, this would come from an API
    setNotifications([
      { id: 1, message: 'New appointment request', time: '10 minutes ago', read: false },
      { id: 2, message: 'Lab results available', time: '1 hour ago', read: false },
      { id: 3, message: 'Prescription renewal', time: '2 hours ago', read: true },
    ]);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  if (!userData) return null;
  
  const userType = userData.type || 'patient';
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar userType={userType} darkMode={darkMode} />
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className={`sticky top-0 z-30 ${
          darkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-200/80'
        } shadow-lg px-6 py-4`}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className={`relative p-2 rounded-full transition ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <BellIcon className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                      userType === 'doctor' ? 'bg-pink-500' : 'bg-green-500'
                    }`}></span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button 
                        className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                              !notif.read 
                                ? (darkMode ? 'bg-gray-700/50' : 'bg-blue-50') 
                                : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <p className={!notif.read ? 'font-medium' : ''}>{notif.message}</p>
                              {!notif.read && (
                                <span className={`w-2 h-2 rounded-full ${
                                  userType === 'doctor' ? 'bg-pink-500' : 'bg-green-500'
                                }`}></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full py-2 text-center text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Dark mode toggle */}
              <button
                className={`p-2 rounded-full transition ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                onClick={toggleDarkMode}
              >
                {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
              </button>
              
              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userType === 'doctor'
                    ? (darkMode ? 'bg-pink-700 text-white' : 'bg-pink-100 text-pink-800')
                    : (darkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800')
                }`}>
                  {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{userData.fullName || 'User'}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                    {userData.type || 'User'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <motion.main
          className="p-6"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          {children}
        </motion.main>
        
        {/* Footer */}
        <footer className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center text-sm`}>
          Arogya Mithra © {new Date().getFullYear()} - All rights reserved
        </footer>
      </div>
    </div>
  );
} 