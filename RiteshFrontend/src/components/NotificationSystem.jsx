import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBell, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimesCircle
} from 'react-icons/fa';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket();

    // Load persisted notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (err) {
        console.error('Error loading notifications:', err);
      }
    }

    // Generate some initial notifications
    generateInitialNotifications();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      // In production, use actual WebSocket URL
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
      
      // For now, simulate WebSocket with polling
      // In real implementation, use: wsRef.current = new WebSocket(wsUrl);
      
      // Simulate receiving notifications
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const newNotification = generateRandomNotification();
          addNotification(newNotification);
        }
      }, 30000); // Check every 30 seconds

      // Store interval for cleanup
      wsRef.current = { close: () => clearInterval(interval) };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    }
  };

  const generateInitialNotifications = () => {
    const initialNotifications = [
      {
        id: '1',
        type: 'success',
        title: 'Welcome!',
        message: 'Your account has been successfully created.',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'New Feature',
        message: 'Check out our new trading calculator!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];

    initialNotifications.forEach(notif => addNotification(notif));
  };

  const generateRandomNotification = () => {
    const types = ['success', 'warning', 'info', 'error'];
    const messages = [
      { type: 'success', title: 'Deposit Approved', message: 'Your deposit request has been approved and credited to your account.' },
      { type: 'warning', title: 'Low Balance', message: 'Your account balance is below the minimum threshold.' },
      { type: 'info', title: 'Market Update', message: 'New trading opportunities available in EUR/USD pair.' },
      { type: 'error', title: 'Withdrawal Failed', message: 'Your withdrawal request could not be processed. Please try again.' },
      { type: 'success', title: 'Trade Executed', message: 'Your trade order has been successfully executed.' },
      { type: 'info', title: 'Bonus Credited', message: 'Your deposit bonus has been credited to your account.' }
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return {
      id: `notif_${Date.now()}_${Math.random()}`,
      type: randomMessage.type,
      title: randomMessage.title,
      message: randomMessage.message,
      timestamp: new Date().toISOString(),
      read: false
    };
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 50); // Keep last 50 notifications
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => prev + 1);

    // Auto-remove after 10 seconds if it's a success/info notification
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 10000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-success-color" />;
      case 'warning':
        return <FaExclamationTriangle className="text-warning-color" />;
      case 'error':
        return <FaTimesCircle className="text-danger-color" />;
      default:
        return <FaInfoCircle className="text-primary-blue" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger-color text-text-quaternary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-card-bg border border-border-color rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border-color flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaBell className="text-accent-color" />
                <h3 className="text-lg font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-accent-color text-text-quaternary text-xs font-semibold px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-accent-color hover:text-accent-color/80"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  <FaBell className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border-color">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-bg-secondary transition-colors cursor-pointer ${
                        !notification.read ? 'bg-primary-blue/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-text-primary">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-text-secondary hover:text-text-primary ml-2"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-text-secondary mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-accent-color rounded-full mt-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border-color">
                <button
                  onClick={clearAll}
                  className="w-full text-sm text-danger-color hover:text-danger-color/80 text-center"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;

