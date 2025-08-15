'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      
      // Show success toast when back online
      toast({
        variant: 'success',
        title: 'Connection restored',
        description: 'You are back online',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      
      // Show warning toast when offline
      toast({
        variant: 'warning',
        title: 'Connection lost',
        description: 'You are currently offline. Some features may be limited.',
        duration: 5000,
      });
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!showOfflineMessage && isOnline) return null;

  return (
    <Badge
      variant={isOnline ? 'success' : 'warning'}
      size="lg"
      icon={isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      className="fixed top-4 right-4 z-50 shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-300"
    >
      {isOnline ? 'Back online' : "You're offline"}
    </Badge>
  );
}
