import { useState, useEffect, useCallback } from 'react';
import type { Reminder } from '../types.js';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const savedReminders = localStorage.getItem('reminders');
      if (savedReminders) {
        const parsed = JSON.parse(savedReminders);
        if (Array.isArray(parsed)) {
          // Robust migration for old reminders. Ensures all properties exist to prevent crashes.
          const migratedReminders = parsed.map((r: any) => ({
            id: r.id || crypto.randomUUID(),
            text: r.text || '',
            dueDate: r.dueDate || '',
            sound: r.sound || 'https://cdn.freesound.org/previews/270/270318_5123851-lq.mp3',
            notified: {
              week: r.notified?.week || false,
              threeDays: r.notified?.threeDays || false,
              oneDay: r.notified?.oneDay || false,
            },
          })).filter(r => r.text && r.dueDate); // Filter out any malformed reminders

          // Sort reminders after migration
          return migratedReminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        }
      }
      return [];
    } catch (error) {
      console.error("Error reading reminders from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error("Error saving reminders to localStorage", error);
    }
  }, [reminders]);

  const addReminder = useCallback((text: string, dueDate: string, sound: string) => {
    if (!text.trim() || !dueDate) return;
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text: text.trim(),
      dueDate,
      sound,
      notified: { week: false, threeDays: false, oneDay: false },
    };
    setReminders(prev => [...prev, newReminder].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateReminderNotified = useCallback((id: string, type: 'week' | 'threeDays' | 'oneDay') => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, notified: { ...r.notified, [type]: true } };
      }
      return r;
    }));
  }, []);

  return { reminders, addReminder, deleteReminder, updateReminderNotified };
};