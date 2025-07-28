import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';
import NotificationPopup from './components/NotificationPopup';
import { useReminders } from './hooks/useReminders';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { Notification } from './types';

const App: React.FC = () => {
  const { reminders, addReminder, deleteReminder, updateReminderNotified, updateReminderLastNotified } = useReminders();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { installPrompt, handleInstallClick } = usePWAInstall();

  const triggerNotification = useCallback((message: string, soundUrl: string) => {
    const newNotification: Notification = { id: crypto.randomUUID(), message };
    setNotifications(prev => [...prev, newNotification]);
    new Audio(soundUrl).play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const checkReminders = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    const todayISO = today.toISOString().split('T')[0];
    const todayDay = today.getDay(); // 0=Sunday, 1=Monday...

    reminders.forEach(reminder => {
      const dueDate = new Date(reminder.dueDate + 'T00:00:00');
      const isRepeating = reminder.repeatDays && reminder.repeatDays.length > 0;

      if (isRepeating) {
        const isAfterStartDate = today.getTime() >= dueDate.getTime();
        const isRepeatDay = reminder.repeatDays!.includes(todayDay);
        
        if (isRepeatDay && isAfterStartDate && reminder.lastNotifiedDate !== todayISO) {
          triggerNotification(`Recordatorio de hoy: ${reminder.text}`, reminder.sound);
          updateReminderLastNotified(reminder.id, todayISO);
        }
      } else {
        const timeDiff = dueDate.getTime() - today.getTime();
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, triggerNotification, updateReminderNotified, updateReminderLastNotified]);

  useEffect(() => {
    checkReminders();
    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkReminders]);

  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-10">
      <main className="max-w-2xl mx-auto">
        <Header installPrompt={installPrompt} handleInstallClick={handleInstallClick} />
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
