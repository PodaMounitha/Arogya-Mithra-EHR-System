import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  HeartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import ChatList from '../shared/ChatList';

const Overview = ({ userData }) => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pendingAppointments: 0,
    pastAppointments: 0,
    activePrescriptions: 0
  });

  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: '72 bpm',
    bloodPressure: '120/80 mmHg',
    bloodSugar: '90 mg/dL'
  });

  useEffect(() => {
    // In a real app, fetch these stats from your API
    setStats({
      upcomingAppointments: 2,
      pendingAppointments: 1,
      pastAppointments: 8,
      activePrescriptions: 3
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
          Welcome, {userData.fullName || userData.email}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={CalendarIcon}
          description="Scheduled appointments"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon={ClockIcon}
          description="Awaiting confirmation"
        />
        <StatCard
          title="Past Appointments"
          value={stats.pastAppointments}
          icon={CheckCircleIcon}
          description="Completed consultations"
        />
        <StatCard
          title="Active Prescriptions"
          value={stats.activePrescriptions}
          icon={BeakerIcon}
          description="Current medications"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Metrics Section */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Health Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
                <h4 className="font-medium">Heart Rate</h4>
              </div>
              <p className="text-2xl font-semibold">{healthMetrics.heartRate}</p>
              <p className="text-sm text-gray-500">Last updated: Today</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <HeartIcon className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="font-medium">Blood Pressure</h4>
              </div>
              <p className="text-2xl font-semibold">{healthMetrics.bloodPressure}</p>
              <p className="text-sm text-gray-500">Last updated: Yesterday</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BeakerIcon className="w-5 h-5 text-purple-500 mr-2" />
                <h4 className="font-medium">Blood Sugar</h4>
              </div>
              <p className="text-2xl font-semibold">{healthMetrics.bloodSugar}</p>
              <p className="text-sm text-gray-500">Last updated: 2 days ago</p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="font-medium">Upcoming Appointment</p>
                <p className="text-sm text-gray-500">Dr. Sarah Wilson - Tomorrow at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <BeakerIcon className="w-8 h-8 text-purple-500 mr-4" />
              <div>
                <p className="font-medium">Prescription Renewal</p>
                <p className="text-sm text-gray-500">Blood Pressure Medication - 3 days left</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-1">
          <ChatList 
            userId={userData.id} 
            userType="patient" 
            token={localStorage.getItem('token')} 
          />
        </div>
      </div>
    </div>
  );
};

export default Overview; 