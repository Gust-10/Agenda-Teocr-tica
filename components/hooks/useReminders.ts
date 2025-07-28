
import { useState, useEffect } from 'react';
import type { Reminder } from '../types';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const savedReminders = localStorage.getItem('reminders');
      if (savedReminders) {
        const parsed = JSON.parse(savedReminders);
        // Ensure the parsed data is an array before trying to map over it.
        // This prevents crashes from corrupted or malformed localStorage data.
        if (Array.isArray(parsed)) {
          return parsed.map((r: any) => ({
            ...r,
            sound: r.sound || 'https://cdn.freesound.org/previews/270/270318_5123851-lq.mp3', // default sound
            repeatDays: r.repeatDays || [], // Ensure repeatDays exists
          }));
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

  const addReminder = (text: string, dueDate: string, sound: string, repeatDays: number[]) => {
    if (!text.trim() || !dueDate) return;
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text: text.trim(),
      dueDate,
      sound,
      notified: { week: false, threeDays: false, oneDay: false },
      repeatDays,
    };
    setReminders(prev => [...prev, newReminder].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const updateReminderNotified = (id: string, type: 'week' | 'threeDays' | 'oneDay') => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, notified: { ...r.notified, [type]: true } };
      }
      return r;
    }));
  };

  const updateReminderLastNotified = (id: string, date: string) => {
    setReminders(prev => prev.map(r => {
        if (r.id === id) {
            return { ...r, lastNotifiedDate: date };
        }
        return r;
    }));
  };


  return { reminders, addReminder, deleteReminder, updateReminderNotified, updateReminderLastNotified };
};
