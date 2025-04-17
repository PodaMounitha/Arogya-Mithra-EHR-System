import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  BeakerIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Records = ({ userData }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, fetch medical records from your API
    const mockRecords = [
      {
        id: 1,
        patientName: 'John Doe',
        patientId: 'P001',
        type: 'Consultation',
        date: '2024-03-15',
        diagnosis: 'Hypertension',
        prescription: 'Lisinopril 10mg',
        notes: 'Blood pressure: 140/90. Follow-up in 2 weeks.',
        status: 'completed'
      },
      {
        id: 2,
        patientName: 'Sarah Smith',
        patientId: 'P002',
        type: 'Lab Test',
        date: '2024-03-18',
        testName: 'Complete Blood Count',
        result: 'Normal',
        notes: 'All parameters within normal range',
        status: 'pending'
      },
      {
        id: 3,
        patientName: 'Mike Johnson',
        patientId: 'P003',
        type: 'Prescription',
        date: '2024-03-20',
        medication: 'Metformin 500mg',
        dosage: 'Twice daily',
        duration: '3 months',
        notes: 'Take with meals',
        status: 'active'
      }
    ];

    setRecords(mockRecords);
    setLoading(false);
  }, []);

  const getRecordIcon = (type) => {
    switch (type) {
      case 'Consultation':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'Lab Test':
        return <BeakerIcon className="w-6 h-6" />;
      case 'Prescription':
        return <ChartBarIcon className="w-6 h-6" />;
      default:
        return <DocumentTextIcon className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'active':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && record.type.toLowerCase() === filter.toLowerCase();
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
        <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultations</option>
            <option value="lab test">Lab Tests</option>
            <option value="prescription">Prescriptions</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-lg">
                {getRecordIcon(record.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {record.patientName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        ({record.patientId})
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {record.date} • {record.type}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                    <button className="flex items-center text-blue-600 hover:text-blue-700">
                      <DocumentArrowDownIcon className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Download</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {record.diagnosis && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Diagnosis:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.diagnosis}</span>
                    </div>
                  )}
                  {record.prescription && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Prescription:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.prescription}</span>
                    </div>
                  )}
                  {record.testName && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Test:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.testName}</span>
                    </div>
                  )}
                  {record.result && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Result:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.result}</span>
                    </div>
                  )}
                  {record.medication && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Medication:</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {record.medication} - {record.dosage} for {record.duration}
                      </span>
                    </div>
                  )}
                  {record.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Notes:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? "No records match your search criteria."
              : "Medical records will appear here after creating them."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Records; 