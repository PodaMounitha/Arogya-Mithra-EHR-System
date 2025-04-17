import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const Records = ({ userData }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch medical records from your API
    const mockRecords = [
      {
        id: 1,
        type: 'Consultation',
        doctorName: 'Dr. John Smith',
        date: '2024-03-15',
        diagnosis: 'Regular checkup',
        prescription: 'Vitamin D supplements',
        notes: 'Patient is in good health. Follow-up in 6 months.'
      },
      {
        id: 2,
        type: 'Lab Test',
        doctorName: 'Dr. Sarah Johnson',
        date: '2024-03-10',
        testName: 'Complete Blood Count',
        result: 'Normal',
        notes: 'All parameters within normal range'
      },
      {
        id: 3,
        type: 'Vaccination',
        doctorName: 'Dr. Michael Brown',
        date: '2024-03-01',
        vaccine: 'Flu Vaccine',
        nextDue: '2025-03-01',
        notes: 'Annual flu vaccination completed'
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
      case 'Vaccination':
        return <ChartBarIcon className="w-6 h-6" />;
      default:
        return <DocumentTextIcon className="w-6 h-6" />;
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
        <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Download All Records
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {records.map((record) => (
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
                    <h3 className="text-lg font-medium text-gray-900">
                      {record.type}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {record.doctorName} • {record.date}
                    </p>
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <DocumentArrowDownIcon className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
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
                  {record.vaccine && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Vaccine:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.vaccine}</span>
                    </div>
                  )}
                  {record.nextDue && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Next Due:</span>
                      <span className="ml-2 text-sm text-gray-500">{record.nextDue}</span>
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

      {records.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No medical records</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your medical records will appear here after your first visit.
          </p>
        </div>
      )}
    </div>
  );
};

export default Records; 