import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Appointments = ({ userData }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch appointments from your API
    const mockAppointments = [
      {
        id: 1,
        doctorName: 'Dr. John Smith',
        specialty: 'Cardiology',
        date: '2024-03-20',
        time: '10:00 AM',
        status: 'upcoming',
        notes: 'Regular checkup'
      },
      {
        id: 2,
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Neurology',
        date: '2024-03-22',
        time: '2:30 PM',
        status: 'pending',
        notes: 'Follow-up consultation'
      },
      {
        id: 3,
        doctorName: 'Dr. Michael Brown',
        specialty: 'General Medicine',
        date: '2024-03-15',
        time: '11:00 AM',
        status: 'completed',
        notes: 'Annual physical examination'
      }
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <CalendarIcon className="w-5 h-5" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <CalendarIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {appointment.doctorName}
                  </h3>
                  <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{appointment.specialty}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {appointment.date} at {appointment.time}
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {appointment.status === 'upcoming' && (
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Cancel
                  </button>
                )}
                {appointment.status === 'completed' && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by booking your first appointment.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Book New Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 