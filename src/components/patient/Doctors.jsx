import { useState, useEffect } from 'react';
import { 
  UserIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Doctors = ({ userData }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch doctors from your API
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. John Smith',
        specialty: 'Cardiology',
        hospital: 'City General Hospital',
        rating: 4.8,
        reviews: 124,
        location: 'New York, NY',
        phone: '+1 (555) 123-4567',
        availability: 'Available today'
      },
      {
        id: 2,
        name: 'Dr. Sarah Johnson',
        specialty: 'Neurology',
        hospital: 'Metropolitan Medical Center',
        rating: 4.9,
        reviews: 98,
        location: 'New York, NY',
        phone: '+1 (555) 234-5678',
        availability: 'Next available: Tomorrow'
      },
      {
        id: 3,
        name: 'Dr. Michael Brown',
        specialty: 'General Medicine',
        hospital: 'Community Health Center',
        rating: 4.7,
        reviews: 156,
        location: 'New York, NY',
        phone: '+1 (555) 345-6789',
        availability: 'Available today'
      }
    ];

    setDoctors(mockDoctors);
    setLoading(false);
  }, []);

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
        <h2 className="text-2xl font-bold text-gray-900">My Doctors</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Find New Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.hospital}</p>
                
                <div className="mt-2 flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{doctor.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({doctor.reviews} reviews)</span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    {doctor.phone}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {doctor.availability}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Book Appointment
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by finding a doctor that matches your needs.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Find New Doctor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors; 