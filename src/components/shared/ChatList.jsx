import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserCircleIcon, 
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Chat from './Chat';

const API_URL = 'http://localhost:5000';

const ChatList = ({ userId, userType, token }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Load contacts based on user type
  useEffect(() => {
    if (!token) return;

    const loadContacts = async () => {
      try {
        setLoading(true);
        
        // Different endpoint based on user type
        const endpoint = userType === 'doctor' 
          ? `${API_URL}/api/chat/patients` 
          : `${API_URL}/api/chat/doctors`;
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setContacts(response.data[userType === 'doctor' ? 'patients' : 'doctors']);
        }
      } catch (err) {
        console.error('Error loading contacts:', err);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [token, userType]);

  // Load unread message counts
  useEffect(() => {
    if (!token) return;

    const loadUnreadCounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/unread`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUnreadCounts(response.data.unread_counts);
        }
      } catch (err) {
        console.error('Error loading unread counts:', err);
      }
    };

    loadUnreadCounts();

    // Refresh unread counts every 30 seconds
    const interval = setInterval(loadUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle contact selection
  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  // Close chat
  const handleCloseChat = () => {
    setSelectedContact(null);
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-8">
          <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-500" />
          Messages
        </h2>
      </div>

      {contacts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No contacts available for chat
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li 
              key={contact.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleContactClick(contact)}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {contact.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {contact.type === 'doctor' ? contact.specialization : 'Patient'}
                  </p>
                </div>
                {unreadCounts[contact.id] > 0 && (
                  <div className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCounts[contact.id]}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedContact && (
        <Chat
          userId={userId}
          token={token}
          recipientId={selectedContact.id}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ChatList; 