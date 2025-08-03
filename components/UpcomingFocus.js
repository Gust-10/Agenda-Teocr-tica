import React from 'react';
import CalendarIcon from './icons/CalendarIcon.js';

const UpcomingFocus = ({ reminders }) => {
  const nextReminder = reminders.length > 0 ? reminders[0] : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure local timezone
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl mx-4 shadow-lg border border-gray-700">
      <div className="flex items-start space-x-4">
        <CalendarIcon className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
        <div>
          {nextReminder ? (
            <>
              <h3 className="font-semibold text-gray-300">Próximo Recordatorio:</h3>
              <p className="text-white text-lg font-medium">{nextReminder.text}</p>
              <p className="text-sm text-indigo-300">{formatDate(nextReminder.dueDate)}</p>
            </>
          ) : (
             <>
              <h3 className="font-semibold text-gray-200">¡Todo en orden!</h3>
              <p className="text-gray-400">No tienes recordatorios pendientes. Añade uno para empezar.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingFocus;