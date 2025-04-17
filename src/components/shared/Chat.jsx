import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000';

const Chat = ({ userId, token, recipientId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    // Create socket connection
    const newSocket = io(API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to chat server');
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'An error occurred');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token]);

  // Get or create chat room
  useEffect(() => {
    if (!recipientId || !token) return;

    const getRoom = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/chat/rooms/private/${recipientId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setRoomId(response.data.room.id);
          
          // Find recipient in room members
          const recipientMember = response.data.room.members.find(
            member => member.user_id !== userId
          );
          
          if (recipientMember) {
            setRecipient(recipientMember.user);
          }
        }
      } catch (err) {
        console.error('Error getting chat room:', err);
        setError('Failed to load chat room');
      } finally {
        setLoading(false);
      }
    };

    getRoom();
  }, [recipientId, token, userId]);

  // Join room and load messages when room is available
  useEffect(() => {
    if (!socket || !roomId) return;

    // Join the room
    socket.emit('join_room', { room_id: roomId });

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      if (data.user_id !== userId) {
        setIsTyping(data.is_typing);
      }
    });

    // Load messages
    const loadMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/rooms/${roomId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();

    // Cleanup
    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.emit('leave_room', { room_id: roomId });
    };
  }, [socket, roomId, token, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomId) return;

    try {
      // Send message via socket
      socket.emit('send_message', {
        room_id: roomId,
        content: newMessage,
        message_type: 'text'
      });

      // Clear input and typing indicator
      setNewMessage('');
      setTyping(false);
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing', { room_id: roomId, is_typing: false });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !roomId) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', { room_id: roomId, is_typing: true });
    }

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', { room_id: roomId, is_typing: false });
    }, 2000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
        <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium">Chat</h3>
          <button onClick={onClose} className="text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
        <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium">Chat</h3>
          <button onClick={onClose} className="text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Chat header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">
          {recipient ? recipient.fullName : 'Chat'}
        </h3>
        <button onClick={onClose} className="text-white">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender_id === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender_id !== userId && (
                <div className="mr-2">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex items-center text-gray-500 text-sm">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="ml-2">{recipient?.fullName} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="bg-gray-100 text-gray-600 px-3 py-2 border border-gray-300 border-l-0"
        >
          <PaperClipIcon className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-r-lg px-3 py-2"
          disabled={!newMessage.trim()}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;

// Add this CSS to your global styles
/*
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 1px;
  background-color: #9ca3af;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
*/ 