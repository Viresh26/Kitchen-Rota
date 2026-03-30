'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-neutral-200 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] transition-all animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">We use cookies</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            We use essential cookies to keep you signed in for up to 365 days, ensuring a seamless experience across your devices. 
            By clicking "Accept All", you consent to our use of these session cookies. 
            Rejecting may require more frequent sign-ins.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Necessary Only
          </button>
          <Button onClick={handleAccept} size="sm">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
