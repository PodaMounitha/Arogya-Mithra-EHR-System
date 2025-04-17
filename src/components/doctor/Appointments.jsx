import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Appointments = ({ userData }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, fetch appointments from your API
    const mockAppointments = [
      {
        id: 1,
        patientName: 'John Doe',
        age: 35,
        date: '2024-03-20',
        time: '10:00 AM',
        type: 'General Checkup',
        status: 'upcoming',
        notes: 'Regular health checkup'
      },
      {
        id: 2,
        patientName: 'Sarah Smith',
        age: 28,
        date: '2024-03-20',
        time: '11:30 AM',
        type: 'Follow-up',
        status: 'upcoming',
        notes: 'Follow-up for previous treatment'
      },
      {
        id: 3,
        patientName: 'Mike Johnson',
        age: 45,
        date: '2024-03-19',
        time: '3:00 PM',
        type: 'Consultation',
        status: 'completed',
        notes: 'Discussed treatment options'
      }
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
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
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {appointment.patientName}
                  </h3>
                  <p className="text-sm text-gray-500">Age: {appointment.age}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {appointment.date} at {appointment.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      {appointment.type}
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="mt-2 text-sm text-gray-500">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-1">
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </span>
                {appointment.status === 'upcoming' && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Start Session
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Cancel
                    </button>
                  </div>
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

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? "You don't have any appointments yet."
              : `No ${filter} appointments found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Appointments; 