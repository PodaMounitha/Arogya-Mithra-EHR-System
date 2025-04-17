// Mock Users
export const doctors = [
  { id: 1, name: 'Dr. John Smith', specialty: 'Cardiology', email: 'doctor@example.com', profileImage: null },
  { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Neurology', email: 'doctor2@example.com', profileImage: null },
  { id: 3, name: 'Dr. Michael Brown', specialty: 'Pediatrics', email: 'michael@example.com', profileImage: null },
  { id: 4, name: 'Dr. Emily Davis', specialty: 'Dermatology', email: 'emily@example.com', profileImage: null },
];

export const patients = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    age: 42,
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    bloodType: 'O+',
    lastVisit: '2023-05-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    gender: 'Female',
    age: 35,
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    bloodType: 'A-',
    lastVisit: '2023-06-02'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    gender: 'Male',
    age: 28,
    phone: '555-456-7890',
    address: '789 Pine Rd, Nowhere, USA',
    bloodType: 'B+',
    lastVisit: '2023-04-20'
  },
  {
    id: 4,
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    gender: 'Female',
    age: 54,
    phone: '555-789-0123',
    address: '321 Maple Ln, Elsewhere, USA',
    bloodType: 'AB+',
    lastVisit: '2023-07-10'
  },
  {
    id: 5,
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    gender: 'Male',
    age: 67,
    phone: '555-234-5678',
    address: '654 Cedar Blvd, Another Town, USA',
    bloodType: 'O-',
    lastVisit: '2023-03-30'
  }
];

// Mock appointments data
export const appointments = [
  {
    id: 1,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 101,
    doctorName: 'Sarah Johnson',
    date: '2023-07-25',
    time: '10:00 AM',
    type: 'Check-up',
    status: 'confirmed',
    notes: 'Annual physical examination'
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Jane Smith',
    doctorId: 102,
    doctorName: 'David Wilson',
    date: '2023-07-26',
    time: '2:30 PM',
    type: 'Follow-up',
    status: 'confirmed',
    notes: 'Follow-up on prescription medicine'
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Michael Johnson',
    doctorId: 101,
    doctorName: 'Sarah Johnson',
    date: '2023-07-27',
    time: '9:15 AM',
    type: 'Consultation',
    status: 'pending',
    notes: 'Initial consultation for back pain'
  },
  {
    id: 4,
    patientId: 4,
    patientName: 'Emily Williams',
    doctorId: 103,
    doctorName: 'James Thompson',
    date: '2023-07-28',
    time: '11:45 AM',
    type: 'Specialist Referral',
    status: 'confirmed',
    notes: 'Cardiology specialist referral'
  },
  {
    id: 5,
    patientId: 5,
    patientName: 'Robert Brown',
    doctorId: 102,
    doctorName: 'David Wilson',
    date: '2023-07-29',
    time: '3:00 PM',
    type: 'Check-up',
    status: 'pending',
    notes: 'Diabetes management check-up'
  },
  {
    id: 6,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 103,
    doctorName: 'James Thompson',
    date: '2023-07-30',
    time: '1:15 PM',
    type: 'Follow-up',
    status: 'confirmed',
    notes: 'Post-surgery follow-up'
  },
  {
    id: 7,
    patientId: 2,
    patientName: 'Jane Smith',
    doctorId: 101,
    doctorName: 'Sarah Johnson',
    date: '2023-08-01',
    time: '10:30 AM',
    type: 'Emergency',
    status: 'confirmed',
    notes: 'Acute allergic reaction'
  },
  {
    id: 8,
    patientId: 3,
    patientName: 'Michael Johnson',
    doctorId: 102,
    doctorName: 'David Wilson',
    date: '2023-08-02',
    time: '4:45 PM',
    type: 'Consultation',
    status: 'pending',
    notes: 'Discuss test results'
  }
];

// Medical Records
export const medicalRecords = [
  {
    id: 1,
    patientId: 1,
    date: '2023-04-15',
    doctorId: 101,
    doctorName: 'Dr. Sarah Johnson',
    type: 'Physical Examination',
    diagnosis: 'Healthy, no significant issues',
    prescription: 'Vitamin D supplement',
    notes: 'Patient reported occasional headaches, recommended to monitor and follow up if persists'
  },
  {
    id: 2,
    patientId: 2,
    date: '2023-05-20',
    doctorId: 102,
    doctorName: 'Dr. David Wilson',
    type: 'Consultation',
    diagnosis: 'Mild hypertension',
    prescription: 'Lisinopril 10mg, once daily',
    notes: 'Advised on lifestyle changes including diet and exercise. Follow up in 3 months.'
  },
  {
    id: 3,
    patientId: 3,
    date: '2023-03-10',
    doctorId: 101,
    doctorName: 'Dr. Sarah Johnson',
    type: 'Emergency Visit',
    diagnosis: 'Acute bronchitis',
    prescription: 'Azithromycin 500mg, Mucinex',
    notes: 'Presented with fever and severe cough. Chest X-ray showed no pneumonia.'
  }
];

// Messages
export const messages = [
  {
    id: 1,
    senderId: 101,
    senderName: 'Dr. Sarah Johnson',
    senderType: 'doctor',
    receiverId: 1,
    receiverName: 'John Doe',
    receiverType: 'patient',
    timestamp: '2023-07-20T13:45:00',
    content: 'Hello John, I wanted to follow up on your last visit. How are you feeling?',
    read: true
  },
  {
    id: 2,
    senderId: 1,
    senderName: 'John Doe',
    senderType: 'patient',
    receiverId: 101,
    receiverName: 'Dr. Sarah Johnson',
    receiverType: 'doctor',
    timestamp: '2023-07-20T14:02:00',
    content: 'Hi Dr. Johnson, I\'m feeling much better. The medication is working well.',
    read: true
  },
  {
    id: 3,
    senderId: 101,
    senderName: 'Dr. Sarah Johnson',
    senderType: 'doctor',
    receiverId: 1,
    receiverName: 'John Doe',
    receiverType: 'patient',
    timestamp: '2023-07-20T14:10:00',
    content: 'Great to hear! Continue with the prescribed dosage and schedule a follow-up appointment if needed.',
    read: false
  },
  {
    id: 4,
    senderId: 102,
    senderName: 'Dr. David Wilson',
    senderType: 'doctor',
    receiverId: 2,
    receiverName: 'Jane Smith',
    receiverType: 'patient',
    timestamp: '2023-07-19T09:30:00',
    content: 'Jane, your lab results came back. Everything looks good, but I\'d like to discuss a few things. Can you schedule an appointment?',
    read: false
  }
];

// Notifications
export const notifications = [
  {
    id: 1,
    userId: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
    timestamp: '2023-07-24T14:30:00',
    read: false
  },
  {
    id: 2,
    userId: 1,
    type: 'prescription',
    title: 'Prescription Refill',
    message: 'Your prescription for Vitamin D is ready for refill',
    timestamp: '2023-07-22T09:15:00',
    read: true
  },
  {
    id: 3,
    userId: 2,
    type: 'lab',
    title: 'Lab Results',
    message: 'Your recent lab results are now available',
    timestamp: '2023-07-23T16:45:00',
    read: false
  },
  {
    id: 4,
    userId: 3,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Dr. David Wilson',
    timestamp: '2023-07-21T11:20:00',
    read: false
  }
];

// Prescriptions
export const prescriptions = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2023, 6, 10),
    instructions: 'Take in the morning with food',
    refillsRemaining: 2
  },
  {
    id: 2,
    patientId: 1,
    doctorId: 1,
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2023, 6, 10),
    instructions: 'Take at bedtime',
    refillsRemaining: 2
  },
  {
    id: 3,
    patientId: 2,
    doctorId: 2,
    medication: 'Sumatriptan',
    dosage: '50mg',
    frequency: 'As needed for migraines',
    startDate: new Date(2023, 3, 15),
    endDate: new Date(2023, 9, 15),
    instructions: 'Take at first sign of migraine. Do not exceed 200mg in 24 hours.',
    refillsRemaining: 3
  },
];

// Health Metrics for Patient Analytics
export const healthMetrics = {
  1: {
    userId: 1,
    heartRate: {
      average: 72,
      readings: [
        { timestamp: '2023-07-20T08:00:00', value: 68 },
        { timestamp: '2023-07-20T12:00:00', value: 74 },
        { timestamp: '2023-07-20T18:00:00', value: 76 },
        { timestamp: '2023-07-21T08:00:00', value: 70 }
      ]
    },
    bloodPressure: {
      average: { systolic: 120, diastolic: 80 },
      readings: [
        { timestamp: '2023-07-20T08:00:00', systolic: 118, diastolic: 78 },
        { timestamp: '2023-07-20T18:00:00', systolic: 122, diastolic: 82 },
        { timestamp: '2023-07-21T08:00:00', systolic: 120, diastolic: 80 }
      ]
    },
    steps: {
      daily: [
        { date: '2023-07-19', count: 8765 },
        { date: '2023-07-20', count: 10234 },
        { date: '2023-07-21', count: 7500 }
      ]
    }
  },
  2: {
    userId: 2,
    heartRate: {
      average: 68,
      readings: [
        { timestamp: '2023-07-20T08:00:00', value: 64 },
        { timestamp: '2023-07-20T12:00:00', value: 70 },
        { timestamp: '2023-07-20T18:00:00', value: 72 },
        { timestamp: '2023-07-21T08:00:00', value: 66 }
      ]
    },
    bloodPressure: {
      average: { systolic: 130, diastolic: 85 },
      readings: [
        { timestamp: '2023-07-20T08:00:00', systolic: 128, diastolic: 84 },
        { timestamp: '2023-07-20T18:00:00', systolic: 132, diastolic: 86 },
        { timestamp: '2023-07-21T08:00:00', systolic: 130, diastolic: 85 }
      ]
    },
    steps: {
      daily: [
        { date: '2023-07-19', count: 6500 },
        { date: '2023-07-20', count: 8700 },
        { date: '2023-07-21', count: 5300 }
      ]
    }
  }
};

// Helper functions to get data by user
export const getPatientAppointments = (patientId) => {
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const getDoctorAppointments = (doctorId) => {
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getPatientById = (patientId) => {
  return patients.find(patient => patient.id === patientId);
};

export const getDoctorById = (doctorId) => {
  return doctors.find(doctor => doctor.id === doctorId);
};

export const getPatientMedicalRecords = (patientId) => {
  return medicalRecords.filter(record => record.patientId === patientId);
};

export const getPatientPrescriptions = (patientId) => {
  return prescriptions.filter(prescription => prescription.patientId === patientId);
};

export const getUserMessages = (userId, isDoctor) => {
  // First, get all messages for the user
  const userMessages = messages.filter(message => 
    (message.senderId === userId && message.receiverId <= (isDoctor ? patients.length : doctors.length)) || 
    (message.receiverId === userId && message.senderId <= (isDoctor ? doctors.length : patients.length))
  );

  // Group messages by conversation (unique pairs of sender and receiver)
  const conversations = {};
  userMessages.forEach(message => {
    const otherId = message.senderId === userId ? message.receiverId : message.senderId;
    const conversationId = `${Math.min(userId, otherId)}-${Math.max(userId, otherId)}`;
    
    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        id: conversationId,
        messages: [],
        patientId: isDoctor ? otherId : userId,
        doctorId: isDoctor ? userId : otherId,
      };
    }
    
    conversations[conversationId].messages.push({
      id: message.id,
      sender: message.senderId === userId ? 'user' : (isDoctor ? 'patient' : 'doctor'),
      content: message.content,
      timestamp: message.timestamp,
      read: message.read,
      status: message.read ? 'read' : 'sent'
    });
  });

  // Convert conversations object to array and sort by last message date
  return Object.values(conversations).map(conv => ({
    ...conv,
    messages: conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  })).sort((a, b) => new Date(b.messages[b.messages.length - 1].timestamp) - new Date(a.messages[a.messages.length - 1].timestamp));
};

export const getUserNotifications = (userId) => {
  return notifications.filter(notification => notification.userId === userId);
};

export const markNotificationAsRead = (userId, notificationId) => {
  notifications = notifications.map(notification => 
    notification.userId === userId && notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  );
};

export const markAllNotificationsAsRead = (userId) => {
  notifications = notifications.map(notification => 
    notification.userId === userId
      ? { ...notification, read: true }
      : notification
  );
};

export const markMessageAsRead = (messageId) => {
  messages.forEach(message => {
    if (message.id === messageId) {
      message.read = true;
    }
  });
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

// Mock data for use when API is unavailable

// Doctor stats
export const mockDoctorStats = () => {
  return {
    totalPatients: 124,
    todayAppointments: 8,
    pendingReports: 3,
    unreadMessages: 5,
    totalRecords: 235,
    unreadNotifications: 2
  };
};

// Doctor patients
export const mockDoctorPatients = () => {
  return [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      age: 42,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      lastVisit: '2023-02-15'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      age: 35,
      gender: 'Female',
      phone: '+1 (555) 987-6543',
      lastVisit: '2023-03-01'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      age: 58,
      gender: 'Male',
      phone: '+1 (555) 456-7890',
      lastVisit: '2023-02-28'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      age: 29,
      gender: 'Female',
      phone: '+1 (555) 789-0123',
      lastVisit: '2023-03-05'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      age: 47,
      gender: 'Male',
      phone: '+1 (555) 321-6547',
      lastVisit: '2023-02-10'
    }
  ];
};

// Doctor medical records
export const mockDoctorMedicalRecords = () => {
  return [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 1,
      date: '2023-02-15',
      type: 'Check-up',
      diagnosis: 'Hypertension',
      notes: 'Patient blood pressure is consistently high. Prescribed medication to control it.'
    },
    {
      id: 2,
      patientName: 'Jane Doe',
      patientId: 2,
      date: '2023-03-01',
      type: 'Follow-up',
      diagnosis: 'Diabetes Type 2',
      notes: 'Sugar levels are better but still above normal range. Adjusted medication dosage.'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 3,
      date: '2023-02-28',
      type: 'Consultation',
      diagnosis: 'Arthritis',
      notes: 'Patient experiencing joint pain. Recommended physical therapy.'
    }
  ];
};

// Patient stats
export const mockPatientStats = () => {
  return {
    upcomingAppointments: 2,
    activePrescriptions: 3,
    unreadMessages: 1,
    totalRecords: 5,
    unreadNotifications: 2
  };
};

// Patient mock appointments for no specific patient ID
export const mockPatientAppointments = () => {
  return [
    {
      id: 1,
      doctorName: 'Dr. Smith',
      doctorId: 1,
      date: '2025-03-15',
      time: '10:00 AM',
      type: 'Check-up',
      status: 'confirmed'
    },
    {
      id: 2,
      doctorName: 'Dr. Johnson',
      doctorId: 2,
      date: '2025-03-22',
      time: '2:30 PM',
      type: 'Follow-up',
      status: 'confirmed'
    }
  ];
};

// Patient prescriptions
export const mockPatientPrescriptions = () => {
  return [
    {
      id: 1,
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2023-02-15',
      endDate: '2023-05-15',
      refillsRemaining: 2,
      prescribedBy: 'Dr. Smith'
    },
    {
      id: 2,
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2023-03-01',
      endDate: '2023-06-01',
      refillsRemaining: 3,
      prescribedBy: 'Dr. Johnson'
    },
    {
      id: 3,
      medication: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      startDate: '2023-02-28',
      endDate: '2023-08-28',
      refillsRemaining: 5,
      prescribedBy: 'Dr. Smith'
    }
  ];
};

// Patient health metrics
export const mockPatientHealthMetrics = () => {
  return {
    healthScore: 85,
    bloodPressure: '120/80',
    bloodPressureStatus: 'normal',
    heartRate: 72,
    heartRateStatus: 'normal',
    bloodGlucose: 95,
    bloodGlucoseStatus: 'normal',
    lastUpdated: '2023-03-05',
    history: [
      {
        date: '2023-03-05',
        bloodPressure: '120/80',
        heartRate: 72,
        bloodGlucose: 95
      },
      {
        date: '2023-02-20',
        bloodPressure: '125/82',
        heartRate: 75,
        bloodGlucose: 98
      },
      {
        date: '2023-02-05',
        bloodPressure: '130/85',
        heartRate: 78,
        bloodGlucose: 105
      }
    ]
  };
};

// User notifications - mock functions without duplicating
export const mockUserNotifications = () => {
  return [
    {
      id: 1,
      userId: 1,
      message: 'Your appointment with Dr. Smith has been confirmed for March 15th at 10:00 AM.',
      timestamp: '2023-03-08T14:30:00',
      read: false
    },
    {
      id: 2,
      userId: 1,
      message: 'Reminder: Your prescription for Lisinopril needs to be refilled soon.',
      timestamp: '2023-03-07T09:15:00',
      read: false
    },
    {
      id: 3,
      userId: 1,
      message: 'Your test results are now available. Please schedule a follow-up appointment.',
      timestamp: '2023-03-05T11:45:00',
      read: true
    },
    {
      id: 4,
      userId: 1,
      message: 'New message from Dr. Johnson regarding your recent visit.',
      timestamp: '2023-03-03T16:20:00',
      read: true
    }
  ];
};

// User messages
export const mockUserMessages = () => {
  return [
    {
      id: 1,
      userId: 1,
      senderId: 2,
      senderName: 'Dr. Johnson',
      message: 'Hello, I have a question about my recent prescription.',
      timestamp: '2023-03-08T15:30:00',
      read: false
    },
    {
      id: 2,
      userId: 1,
      senderId: 2,
      senderName: 'Dr. Johnson',
      message: 'When should I schedule my next appointment?',
      timestamp: '2023-03-07T10:15:00',
      read: true
    },
    {
      id: 3,
      userId: 1,
      senderId: 3,
      senderName: 'Dr. Williams',
      message: 'Thanks for the consultation yesterday. The new medication seems to be working well.',
      timestamp: '2023-03-06T14:45:00',
      read: true
    }
  ];
}; 