
export interface Reminder {
  id: string;
  text: string;
  dueDate: string; // ISO string format for the date
  sound: string; // URL of the notification sound
  notified: {
    week: boolean;
    threeDays: boolean;
    oneDay: boolean;
  };
}

export interface Notification {
  id: string;
  message: string;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
