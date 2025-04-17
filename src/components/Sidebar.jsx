import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

export default function Sidebar({ userType = 'doctor', darkMode = false }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Menu items based on user type
  const getMenuItems = () => {
    const commonItems = [
      {
        name: 'Dashboard',
        icon: <HomeIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard`,
      },
      {
        name: 'Appointments',
        icon: <CalendarIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard/appointments`,
      },
      {
        name: 'Medical Records',
        icon: <DocumentTextIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard/medical-records`,
      },
      {
        name: 'Notifications',
        icon: <BellIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard/notifications`,
      },
      {
        name: 'Messages',
        icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard/messages`,
      },
      {
        name: 'Settings',
        icon: <Cog6ToothIcon className="w-6 h-6" />,
        path: `/${userType}-dashboard/settings`,
      },
    ];
    
    // Doctor specific items
    if (userType === 'doctor') {
      return [
        ...commonItems.slice(0, 1), // Dashboard
        {
          name: 'Patients',
          icon: <UsersIcon className="w-6 h-6" />,
          path: `/${userType}-dashboard/patients`,
        },
        ...commonItems.slice(1, 5), // Appointments to Messages
        {
          name: 'Analytics',
          icon: <ChartBarIcon className="w-6 h-6" />,
          path: `/${userType}-dashboard/analytics`,
        },
        commonItems[5], // Settings
      ];
    }
    
    return commonItems;
  };
  
  const menuItems = getMenuItems();
  
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login');
  };
  
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'HomeIcon':
        return HomeIcon;
      case 'UserGroupIcon':
        return UserGroupIcon;
      case 'CalendarIcon':
        return CalendarIcon;
      case 'DocumentTextIcon':
        return DocumentTextIcon;
      case 'CogIcon':
        return Cog6ToothIcon;
      default:
        return HomeIcon;
    }
  };
  
  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className={`fixed z-50 top-4 ${isOpen ? 'left-64' : 'left-4'} p-2 rounded-full ${
            darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
          } shadow-lg`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      )}
    
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 z-40 h-full ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
        } shadow-xl w-64 overflow-y-auto transition-transform`}
        initial={isMobile ? 'closed' : 'open'}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="p-5">
          <div className="flex items-center justify-center mb-8">
            <h1 className={`text-2xl font-bold ${
              userType === 'doctor' 
                ? (darkMode ? 'text-pink-400' : 'text-pink-600') 
                : (darkMode ? 'text-green-400' : 'text-green-600')
            }`}>
              Arogya Mithra
              <span className={`ml-2 text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userType === 'doctor' ? 'Doctor' : 'Patient'}
              </span>
            </h1>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path || location.pathname === item.path + '/'
                        ? userType === 'doctor'
                          ? (darkMode ? 'bg-pink-900/30 text-pink-200' : 'bg-pink-100 text-pink-800')
                          : (darkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800')
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${
                      location.pathname === item.path || location.pathname === item.path + '/'
                        ? userType === 'doctor'
                          ? (darkMode ? 'text-pink-300' : 'text-pink-600')
                          : (darkMode ? 'text-green-300' : 'text-green-600')
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    } mr-3`}>
                      {getIcon(item.name.replace(' ', '').replace('-', ''))}
                    </span>
                    {item.name}
                    
                    {/* Notification badge for certain items */}
                    {(item.name === 'Notifications' || item.name === 'Messages') && (
                      <span className={`ml-auto inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                        userType === 'doctor'
                          ? (darkMode ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white')
                          : (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                      }`}>
                        {Math.floor(Math.random() * 5) + 1}
                      </span>
                    )}
                  </Link>
                </motion.li>
              ))}
              
              {/* Sign Out Button */}
              <motion.li variants={itemVariants} className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSignOut}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`}>
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                  </span>
                  Sign Out
                </button>
              </motion.li>
            </ul>
          </nav>
        </div>
      </motion.div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 