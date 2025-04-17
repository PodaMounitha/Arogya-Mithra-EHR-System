import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';

const DashboardLayout = ({ 
  userData, 
  navigation, 
  userType = "user" 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Get current active path
  const currentPath = location.pathname.split('/')[2] || '';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar component */}
      <Sidebar 
        navigation={navigation}
        activePath={currentPath}
        userType={userType}
        userData={userData}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet context={userData} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 