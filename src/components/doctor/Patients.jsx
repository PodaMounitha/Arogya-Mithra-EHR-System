import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patients } from '../../utils/mockData';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import { UserGroupIcon, UserIcon, CalendarIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Patients = ({ userData }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, fetch patients from your API
    const mockPatients = [
      {
        id: 1,
        name: 'John Doe',
        age: 35,
        gender: 'Male',
        lastVisit: '2024-03-15',
        nextAppointment: '2024-03-22',
        condition: 'Hypertension',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com'
      },
      {
        id: 2,
        name: 'Sarah Smith',
        age: 28,
        gender: 'Female',
        lastVisit: '2024-03-18',
        nextAppointment: '2024-03-25',
        condition: 'Diabetes Type 2',
        phone: '+1 (555) 234-5678',
        email: 'sarah.smith@example.com'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        age: 45,
        gender: 'Male',
        lastVisit: '2024-03-10',
        nextAppointment: null,
        condition: 'Arthritis',
        phone: '+1 (555) 345-6789',
        email: 'mike.johnson@example.com'
      }
    ];

    setPatients(mockPatients);
    setLoading(false);
  }, []);

  // Filter patients by search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle action button clicks
  const handleViewRecords = () => {
    if (selectedPatient) {
      navigate(`/doctor-dashboard/records?patientId=${selectedPatient.id}`);
    }
  };
  
  const handleScheduleAppointment = () => {
    if (selectedPatient) {
      navigate(`/doctor-dashboard/appointments?patientId=${selectedPatient.id}`);
    }
  };
  
  const handleSendMessage = () => {
    if (selectedPatient) {
      navigate(`/doctor-dashboard/messages?patientId=${selectedPatient.id}`);
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
    <div>
      <PageHeader 
        title="Patients" 
        description="Manage your patient list and view patient information"
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Patient List */}
        <div className="w-full lg:w-2/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add New Patient
              </button>
            </div>
          </div>
          
          <div className="bg-medical-box-light rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-700">
              {filteredPatients.map(patient => (
                <li 
                  key={patient.id}
                  className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedPatient?.id === patient.id ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">{patient.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-white">{patient.name}</h3>
                      <p className="text-sm text-gray-400">{patient.condition}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Patient Details */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          {selectedPatient ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-2xl font-medium text-white">{selectedPatient.name.charAt(0)}</span>
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-white">{selectedPatient.name}</h2>
                  <p className="text-gray-400">{selectedPatient.condition}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Age</h3>
                  <p className="text-white">{selectedPatient.age} years</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Gender</h3>
                  <p className="text-white">{selectedPatient.gender}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Blood Type</h3>
                  <p className="text-white">{selectedPatient.bloodType}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Patient ID</h3>
                  <p className="text-white">#{selectedPatient.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleViewRecords}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  View Medical Records
                </button>
                <button 
                  onClick={handleScheduleAppointment}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Schedule Appointment
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <UserGroupIcon className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Patient Selected</h3>
              <p className="text-gray-400 max-w-md">
                Select a patient from the list to view their detailed information, medical records, and manage their appointments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients; 