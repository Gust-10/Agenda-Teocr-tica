
import React from 'react';
import type { Reminder } from '../types';
import ReminderItem from './ReminderItem';

interface ReminderListProps {
  reminders: Reminder[];
  deleteReminder: (id: string) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders, deleteReminder }) => {
  return (
    <div className="p-4 mx-4 mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Tus Recordatorios</h2>
      {reminders.length > 0 ? (
        <ul className="space-y-3">
          {reminders.map(reminder => (
            <ReminderItem key={reminder.id} reminder={reminder} deleteReminder={deleteReminder} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">¡Todo en orden!</p>
          <p className="text-gray-500 text-sm mt-1">Añade un nuevo recordatorio para empezar.</p>
        </div>
      )}
    </div>
  );
};

export default ReminderList;
