
import React from 'react';
import type { Reminder } from '../types.js';
import TrashIcon from './icons/TrashIcon.jsx';

interface ReminderItemProps {
  reminder: Reminder;
  deleteReminder: (id: string) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, deleteReminder }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is parsed in local timezone
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <li className="bg-gray-800 p-4 rounded-lg flex items-center justify-between transition-transform hover:scale-[1.02] duration-200">
      <div>
        <p className="text-white font-medium">{reminder.text}</p>
        <p className="text-sm text-indigo-300">{`Vence: ${formatDate(reminder.dueDate)}`}</p>
      </div>
      <button
        onClick={() => deleteReminder(reminder.id)}
        className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        aria-label="Eliminar recordatorio"
      >
        <TrashIcon />
      </button>
    </li>
  );
};

export default ReminderItem;