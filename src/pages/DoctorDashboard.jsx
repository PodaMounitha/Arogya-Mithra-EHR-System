import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Overview from '../components/doctor/Overview';
import Patients from '../components/doctor/Patients';
import Appointments from '../components/doctor/Appointments';
import Records from '../components/doctor/Records';
import Settings from '../components/doctor/Settings';
import DashboardLayout from '../components/shared/DashboardLayout';
import { getUserMessages } from '../utils/mockData';
import { 
  getDoctorStats, 
  getDoctorAppointments, 
  getDoctorPatients, 
  getDoctorMedicalRecords 
} from '../services/api';
import DashboardCard from '../components/DashboardCard';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, path: '' },
  { name: 'Patients', icon: UserGroupIcon, path: 'patients' },
  { name: 'Appointments', icon: CalendarIcon, path: 'appointments' },
  { name: 'Medical Records', icon: DocumentTextIcon, path: 'records' },
  { name: 'Notifications', icon: BellIcon, path: 'notifications' },
  { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: 'messages' },
  { name: 'Analytics', icon: ChartBarIcon, path: 'analytics' },
  { name: 'Settings', icon: Cog6ToothIcon, path: 'settings' },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    if (path && path !== 'doctor-dashboard') {
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
    { id: 'patients', label: 'Patients', icon: 'UserGroupIcon' },
    { id: 'appointments', label: 'Appointments', icon: 'CalendarIcon' },
    { id: 'records', label: 'Medical Records', icon: 'DocumentTextIcon' },
    { id: 'settings', label: 'Settings', icon: 'CogIcon' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview userData={userData} />;
      case 'patients':
        return <Patients userData={userData} />;
      case 'appointments':
        return <Appointments userData={userData} />;
      case 'records':
        return <Records userData={userData} />;
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
        userRole="Doctor"
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;

function DashboardHome({ user }) {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, appointmentsData, patientsData, recordsData] = await Promise.all([
        getDoctorStats(),
        getDoctorAppointments(),
        getDoctorPatients(),
        getDoctorMedicalRecords()
      ]);
      
      setStats(statsData);
      setActivities(appointmentsData.map(a => ({
        id: a.id,
        type: a.status === 'confirmed' ? 'appointment' : a.status === 'pending' ? 'pending' : 'completed',
        message: a.status === 'confirmed' ? 'New appointment with ' + a.patientName : a.status === 'pending' ? 'Appointment pending confirmation' : 'Appointment completed',
        time: new Date(a.date).toLocaleTimeString()
      })));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for dark mode changes
    const darkModeListener = () => {
      setDarkMode(localStorage.getItem('darkMode') === 'true');
    };
    
    window.addEventListener('storage', darkModeListener);
    return () => window.removeEventListener('storage', darkModeListener);
  }, []);
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'appointment':
        return <CalendarIcon className="w-5 h-5" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'completed':
        return <DocumentTextIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };
  
  const refreshData = () => {
    setLoading(true);
    fetchDashboardData();
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Patients" 
          icon={<UserGroupIcon className="w-5 h-5" />}
          darkMode={darkMode}
          delay={0.1}
        >
          <div className="text-3xl font-bold mt-2">{stats?.totalPatients || 0}</div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Registered patients
          </p>
        </DashboardCard>
        
        <DashboardCard 
          title="Today's Appointments" 
          icon={<CalendarIcon className="w-5 h-5" />}
          darkMode={darkMode}
          loading={loading}
          onRefresh={refreshData}
          delay={0.2}
          footer={
            <button className={`text-sm ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              View all appointments
            </button>
          }
        >
          <div className="text-3xl font-bold mt-2">{stats?.todayAppointments || 0}</div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Upcoming schedule
          </p>
        </DashboardCard>
        
        <DashboardCard 
          title="Pending Appointments" 
          icon={<ClockIcon className="w-5 h-5" />}
          darkMode={darkMode}
          delay={0.3}
        >
          <div className="text-3xl font-bold mt-2">{stats?.pendingAppointments || 0}</div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Waiting for confirmation
          </p>
        </DashboardCard>
        
        <DashboardCard 
          title="Completed" 
          icon={<DocumentTextIcon className="w-5 h-5" />}
          darkMode={darkMode}
          delay={0.4}
        >
          <div className="text-3xl font-bold mt-2">{stats?.completedAppointments || 0}</div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Past appointments
          </p>
        </DashboardCard>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <DashboardCard 
          title="Today's Appointments" 
          icon={<CalendarIcon className="w-5 h-5" />}
          darkMode={darkMode}
          loading={loading}
          onRefresh={refreshData}
          delay={0.5}
          footer={
            <button className={`text-sm ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              View all appointments
            </button>
          }
        >
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start p-3 rounded-lg ${
                  darkMode 
                    ? activity.type === 'confirmed' ? 'bg-green-900/20' : activity.type === 'pending' ? 'bg-yellow-900/20' : 'bg-gray-700/50'
                    : activity.type === 'confirmed' ? 'bg-green-50' : activity.type === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.message}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.type === 'confirmed'
                        ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                        : activity.type === 'pending'
                          ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                          : darkMode ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
        
        {/* Recent Activity */}
        <DashboardCard 
          title="Recent Activity" 
          icon={<BellIcon className="w-5 h-5" />}
          darkMode={darkMode}
          loading={loading}
          onRefresh={refreshData}
          delay={0.6}
          footer={
            <button className={`text-sm ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              View all activity
            </button>
          }
        >
          <div className="space-y-4">
            {activities.slice(3).map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                
                <div>
                  <p>{activity.message}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}