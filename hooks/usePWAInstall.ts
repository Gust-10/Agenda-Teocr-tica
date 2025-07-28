
import { useState, useEffect, useCallback } from 'react';
import type { BeforeInstallPromptEvent } from '../types';

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!installPrompt) {
      return;
    }
    // Show the install prompt.
    await installPrompt.prompt();
    // Wait for the user to respond to the prompt.
    const { outcome } = await installPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it.
    setInstallPrompt(null);
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User dismissed the PWA installation');
    }
  }, [installPrompt]);

  return { installPrompt, handleInstallClick };
};
