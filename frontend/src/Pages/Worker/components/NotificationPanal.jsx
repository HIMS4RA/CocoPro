import React from 'react';
import { AlertCircleIcon, InfoIcon, CheckCircleIcon, XIcon } from 'lucide-react';

const NotificationPanel = ({ notifications, onDismiss, onMarkAsRead, maxHeight = '400px' }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircleIcon className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type, read) => {
    if (read) return 'bg-gray-50';
    switch (type) {
      case 'info':
        return 'bg-blue-50';
      case 'warning':
        return 'bg-amber-50';
      case 'error':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">Notifications</h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 border-b border-gray-100 ${getBackgroundColor(notification.type, notification.read)}`}
                onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {onDismiss && (
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(notification.id);
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
