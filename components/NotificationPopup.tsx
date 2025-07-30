import React, { useEffect } from 'react';
import BellIcon from './icons/BellIcon';
import type { Notification } from '../types';

interface NotificationPopupProps {
  notification: Notification | null;
  onClose: (id: string) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="w-full max-w-sm bg-indigo-600 text-white p-4 rounded-lg shadow-2xl animate-fade-in-down">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <BellIcon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onClose(notification.id)}
            className="inline-flex rounded-md p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;