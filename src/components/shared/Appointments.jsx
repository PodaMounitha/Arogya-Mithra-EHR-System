import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as mockData from '../../utils/mockData';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PlusIcon, 
  CheckIcon, 
  XMarkIcon, 
  TrashIcon, 
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export default function Appointments({ userType, userId }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'check-up',
    notes: '',
    doctorId: '',
    patientId: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Get patient ID from URL query parameters if available
  const patientId = searchParams.get('patientId') ? parseInt(searchParams.get('patientId')) : null;
  
  useEffect(() => {
    fetchAppointments();
  }, [userType, userId, patientId]);
  
  const getOptions = () => {
    if (userType === 'doctor') {
      return {
        title: 'Patient Appointments',
        emptyMessage: 'No patient appointments found',
        buttonText: 'New Patient Appointment',
        selectOptions: mockData.patients
      };
    } else {
      return {
        title: 'My Appointments',
        emptyMessage: 'You have no scheduled appointments',
        buttonText: 'Schedule New Appointment',
        selectOptions: mockData.doctors
      };
    }
  };
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Use mock data for appointments
      let userAppointments = [];
      if (userType === 'doctor') {
        // Use the appointments from mockData and filter them
        userAppointments = mockData.appointments.filter(appointment => 
          appointment.doctorId === Number(userId) && 
          (!patientId || appointment.patientId === patientId)
        );
      } else {
        userAppointments = mockData.appointments.filter(appointment => 
          appointment.patientId === Number(userId)
        );
      }
      setAppointments(userAppointments);
    } catch (error) {
      setError('Failed to load appointments. Please try again.');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      // Create a new appointment in our mock data
      const newAppointment = {
        id: Date.now(), // Generate a unique ID
        date: formData.date,
        time: formData.time,
        type: formData.type,
        notes: formData.notes,
        status: 'confirmed',
        doctorId: userType === 'patient' ? Number(formData.doctorId) : Number(userId),
        patientId: userType === 'doctor' ? Number(formData.patientId) : Number(userId),
        doctorName: userType === 'patient' ? 
          mockData.doctors.find(d => d.id === Number(formData.doctorId))?.name : 
          '',
        patientName: userType === 'doctor' ? 
          mockData.patients.find(p => p.id === Number(formData.patientId))?.name : 
          ''
      };
      
      // Add the new appointment to our local state
      setAppointments(prev => [...prev, newAppointment]);
      
      // Reset form and close modal
      setFormData({
        date: '',
        time: '',
        type: 'check-up',
        notes: '',
        doctorId: '',
        patientId: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      // Update status in local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status } 
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Failed to update appointment status. Please try again.');
    }
  };

  const handleDelete = async (appointmentId) => {
    setDeleteConfirm(appointmentId);
  };

  const confirmDelete = async (appointmentId) => {
    try {
      // Remove appointment from local state
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  // Filter appointments based on active tab
  const currentDate = new Date();
  const upcomingAppointments = appointments.filter(appt => new Date(appt.date) >= currentDate);
  const pastAppointments = appointments.filter(appt => new Date(appt.date) < currentDate);
  
  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Appointments" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1 max-w-md">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <PageHeader 
          title="Appointments" 
          description={patientId ? `Appointments for ${mockData.patients.find(p => p.id === patientId)?.name}` : "Manage your upcoming and past appointments"}
        />
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Schedule Appointment
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <XMarkIcon className="h-5 w-5 inline" />
          </button>
        </div>
      )}
      
      {/* Tab navigation */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'upcoming' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'past' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Past
        </button>
      </div>
      
      {displayAppointments.length > 0 ? (
        <div className="space-y-4">
          {displayAppointments.map(appointment => {
            // Get the other party's info (doctor or patient)
            const otherParty = userType === 'doctor' 
              ? mockData.patients.find(p => p.id === appointment.patientId)
              : mockData.doctors.find(d => d.id === appointment.doctorId);
            
            const appointmentDate = new Date(appointment.date);
            const isToday = new Date().toDateString() === appointmentDate.toDateString();
            const isPast = appointmentDate < new Date();
            
            return (
              <div 
                key={appointment.id}
                className={`p-4 rounded-lg transition-all duration-200 ${
                  isToday 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                    : isPast
                      ? 'bg-white dark:bg-gray-800 opacity-75' 
                      : 'bg-white dark:bg-gray-800 shadow'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-start md:w-1/3">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                      isToday 
                        ? 'bg-blue-100 dark:bg-blue-800' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <CalendarIcon className={`h-6 w-6 ${
                        isToday 
                          ? 'text-blue-500 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userType === 'doctor' ? appointment.patientName || otherParty?.name : appointment.doctorName || otherParty?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:flex-1 md:ml-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </span>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex items-center space-x-2">
                      {!isPast && (
                        <>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </span>
                          
                          {deleteConfirm === appointment.id ? (
                            <div className="ml-2 flex items-center space-x-2">
                              <button
                                onClick={() => confirmDelete(appointment.id)}
                                className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800/30"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDelete(appointment.id)}
                              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                      
                      {isPast && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mt-4 pl-16">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CalendarIcon}
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming' ? "You don't have any upcoming appointments. Schedule a new appointment to get started." : "You don't have any past appointments."}
        />
      )}
    </div>
  );
} 