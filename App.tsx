import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';
import NotificationPopup from './components/NotificationPopup';
import UpcomingFocus from './components/UpcomingFocus';
import { useReminders } from './hooks/useReminders';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { Notification } from './types';

const App: React.FC = () => {
  const { reminders, addReminder, deleteReminder, updateReminderNotified } = useReminders();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { installPrompt, handleInstallClick } = usePWAInstall();

  const triggerNotification = useCallback((message: string, soundUrl: string) => {
    const newNotification: Notification = { id: crypto.randomUUID(), message };
    setNotifications(prev => [...prev, newNotification]);
    new Audio(soundUrl).play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const checkReminders = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only

    reminders.forEach(reminder => {
      const dueDate = new Date(reminder.dueDate + 'T00:00:00');
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1 && daysDiff >= 0 && !reminder.notified.oneDay) {
        triggerNotification(`Recordatorio para mañana: ${reminder.text}`, reminder.sound);
        updateReminderNotified(reminder.id, 'oneDay');
      } else if (daysDiff <= 3 && daysDiff > 1 && !reminder.notified.threeDays) {
        triggerNotification(`Recordatorio en 3 días: ${reminder.text}`, reminder.sound);
        updateReminderNotified(reminder.id, 'threeDays');
      } else if (daysDiff <= 7 && daysDiff > 3 && !reminder.notified.week) {
        triggerNotification(`Recordatorio en una semana: ${reminder.text}`, reminder.sound);
        updateReminderNotified(reminder.id, 'week');
      }
    });
  }, [reminders, triggerNotification, updateReminderNotified]);

  useEffect(() => {
    // Defer the initial check to break any potential synchronous render-effect loop.
    // This gives React time to finish the current render before the check triggers another state update.
    const initialCheckTimer = setTimeout(checkReminders, 1);
    
    // Set up an interval to check every minute
    const intervalId = setInterval(checkReminders, 60000);

    return () => {
      clearTimeout(initialCheckTimer);
      clearInterval(intervalId);
    };
  }, [checkReminders]);

  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-10">
      <main className="max-w-2xl mx-auto">
        <Header installPrompt={installPrompt} handleInstallClick={handleInstallClick} />
        <div className="my-6 space-y-6">
          <UpcomingFocus reminders={reminders} />
        </div>
        <ReminderForm addReminder={addReminder} />
        <ReminderList reminders={reminders} deleteReminder={deleteReminder} />
      </main>
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3">
        {notifications.map(notification => (
          <NotificationPopup
            key={notification.id}
            notification={notification}
            onClose={closeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
