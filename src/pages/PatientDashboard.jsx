import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BeakerIcon,
  HeartIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Overview from '../components/patient/Overview';
import Appointments from '../components/patient/Appointments';
import Records from '../components/patient/Records';
import Doctors from '../components/patient/Doctors';
import Settings from '../components/patient/Settings';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, path: '' },
  { name: 'Appointments', icon: CalendarIcon, path: 'appointments' },
  { name: 'Medical Records', icon: DocumentTextIcon, path: 'records' },
  { name: 'Prescriptions', icon: BeakerIcon, path: 'prescriptions' },
  { name: 'Health Tracker', icon: HeartIcon, path: 'health-tracker' },
  { name: 'Notifications', icon: BellIcon, path: 'notifications' },
  { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: 'messages' },
  { name: 'Analytics', icon: ChartBarIcon, path: 'analytics' },
  { name: 'Settings', icon: Cog6ToothIcon, path: 'settings' },
];

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle invalid user data by redirecting to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        navigate('/login');
      }
    } else {
      // No user data found, redirect to login
      navigate('/login');
    }

    // Set active tab based on URL path
    const path = location.pathname.split('/').pop();
    if (path && path !== 'patient-dashboard') {
      setActiveTab(path);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  if (!userData) {
    return null; // or a loading spinner
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
    { id: 'appointments', label: 'Appointments', icon: 'CalendarIcon' },
    { id: 'records', label: 'Medical Records', icon: 'DocumentTextIcon' },
    { id: 'doctors', label: 'My Doctors', icon: 'UserIcon' },
    { id: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview userData={userData} />;
      case 'appointments':
        return <Appointments userData={userData} />;
      case 'records':
        return <Records userData={userData} />;
      case 'doctors':
        return <Doctors userData={userData} />;
      case 'settings':
        return <Settings userData={userData} onLogout={handleLogout} />;
      default:
        return <Overview userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userName={userData.fullName || userData.email}
        userRole="Patient"
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;