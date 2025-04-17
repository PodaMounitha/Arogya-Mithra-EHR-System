import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ChatList from '../shared/ChatList';

const Overview = ({ userData }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });

  useEffect(() => {
    // In a real app, fetch these stats from your API
    setStats({
      totalPatients: 156,
      todayAppointments: 8,
      pendingAppointments: 3,
      completedAppointments: 245
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, Dr. {userData.fullName || userData.email}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={UserGroupIcon}
          description="Registered patients"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={CalendarIcon}
          description="Scheduled for today"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon={ClockIcon}
          description="Awaiting confirmation"
        />
        <StatCard
          title="Completed Appointments"
          value={stats.completedAppointments}
          icon={CheckCircleIcon}
          description="Total consultations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="font-medium">Next Appointment</p>
                <p className="text-sm text-gray-500">John Doe - Today at 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <UserGroupIcon className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <p className="font-medium">New Patient Registration</p>
                <p className="text-sm text-gray-500">Sarah Smith - 30 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-1">
          <ChatList 
            userId={userData.id} 
            userType="doctor" 
            token={localStorage.getItem('token')} 
          />
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-4">
          {stats.todayAppointments > 0 ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Patient {index + 1}</p>
                    <p className="text-sm text-gray-500">General Checkup</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{10 + index}:00 AM</p>
                  <p className="text-sm text-gray-500">30 min</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No appointments scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 