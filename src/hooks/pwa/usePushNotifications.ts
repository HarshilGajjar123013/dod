import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'default';
    }
  };

  const sendMockNotification = (options: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
    tag?: string;
  }) => {
    if (!isSupported || Notification.permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted');
      return false;
    }

    // Try sending message to Service Worker controller
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SIMULATE_NOTIFICATION',
        ...options
      });
      return true;
    } else {
      // Fallback to client-side notification if service worker controller is not active yet
      try {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          tag: options.tag
        });
        return true;
      } catch (err) {
        console.error('Failed to display fallback notification:', err);
        return false;
      }
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendMockNotification,
  };
}
