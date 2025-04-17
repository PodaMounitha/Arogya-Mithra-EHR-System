import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mockData from '../../utils/mockData';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import { 
  BellIcon, 
  CheckCircleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Notifications({ userType, userId }) {
  const navigate = useNavigate();
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  
  // Get user notifications - using mock data
  useEffect(() => {
    setLoading(true);
    try {
      // Using mock notifications to simulate real data
      const userNotifications = mockData.mockUserNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Apply filtering
  const filteredNotifications = viewMode === 'unread' 
    ? sortedNotifications.filter(notification => !notification.read)
    : viewMode === 'read'
      ? sortedNotifications.filter(notification => notification.read)
      : sortedNotifications;
  
  // Mark notification as read
  const handleMarkAsRead = (notificationId) => {
    setMarkingAsRead(true);
    try {
      // Update local state to simulate backend update
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      // Show visual feedback of success
      setTimeout(() => setMarkingAsRead(false), 500);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setMarkingAsRead(false);
    }
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setMarkingAsRead(true);
    try {
      // Update local state to simulate backend update
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      // Show visual feedback of success
      setTimeout(() => setMarkingAsRead(false), 500);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setMarkingAsRead(false);
    }
  };
  
  // Get notification icon by type
  const getNotificationIcon = (message) => {
    if (message.includes('appointment')) {
      return CalendarIcon;
    } else if (message.includes('message')) {
      return ChatBubbleLeftRightIcon;
    } else if (message.includes('test results') || message.includes('prescription')) {
      return DocumentTextIcon;
    } else {
      return BellIcon;
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Notifications" />
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

  const handleViewMessage = () => {
    navigate(`/${userType.toLowerCase()}-dashboard/messages`);
  };

  const handleViewAppointment = () => {
    navigate(`/${userType.toLowerCase()}-dashboard/appointments`);
  };
  
  return (
    <div className="p-4">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with important information"
      />
      
      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setViewMode('unread')}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === 'unread' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setViewMode('read')}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === 'read' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Read
        </button>
      </div>
      
      {/* Mark all as read button (only show if there are unread notifications) */}
      {filteredNotifications.filter(n => !n.read).length > 0 && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAsRead}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center shadow"
          >
            {markingAsRead ? (
              <>
                <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Marking as read...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-1" />
                Mark all as read
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Notifications list */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map(notification => {
            const IconComponent = getNotificationIcon(notification.message);
            
            return (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg transition-all duration-200 ${
                  notification.read 
                    ? 'bg-white dark:bg-gray-800 opacity-75' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 shadow-md'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    notification.read 
                      ? 'bg-gray-100 dark:bg-gray-700' 
                      : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      notification.read 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-blue-500 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${
                        notification.read 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {!notification.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {notification.message.includes('appointment') && (
                        <button 
                          onClick={handleViewAppointment}
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                        >
                          View appointment
                        </button>
                      )}
                      {notification.message.includes('message') && (
                        <button 
                          onClick={handleViewMessage}
                          className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                        >
                          View message
                        </button>
                      )}
                      {(notification.message.includes('test results') || notification.message.includes('prescription')) && (
                        <button 
                          className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                        >
                          View record
                        </button>
                      )}
                      {!notification.read && !notification.message.includes('appointment') && !notification.message.includes('message') && !notification.message.includes('test results') && !notification.message.includes('prescription') && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BellIcon}
          title="No notifications"
          description="You're all caught up! There are no notifications to display at this time."
        />
      )}
    </div>
  );
} 