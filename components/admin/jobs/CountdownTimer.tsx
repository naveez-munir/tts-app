'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(endDate: string): TimeRemaining {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

function formatTimeRemaining(time: TimeRemaining): string {
  if (time.isExpired) {
    return 'Bidding ended';
  }

  const parts: string[] = [];

  if (time.days > 0) {
    parts.push(`${time.days}d`);
  }
  if (time.hours > 0 || time.days > 0) {
    parts.push(`${time.hours}h`);
  }
  if (time.minutes > 0 || time.hours > 0 || time.days > 0) {
    parts.push(`${time.minutes}m`);
  }
  parts.push(`${time.seconds}s`);

  return `${parts.join(' ')} remaining`;
}

export function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(endDate)
  );

  useEffect(() => {
    // Update immediately on mount
    setTimeRemaining(calculateTimeRemaining(endDate));

    // Set up interval to update every second
    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining(endDate);
      setTimeRemaining(newTime);

      // Stop the interval if time has expired
      if (newTime.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className={`w-4 h-4 ${timeRemaining.isExpired ? 'text-error-600' : 'text-warning-600'}`} />
      <span
        className={`text-sm font-medium ${
          timeRemaining.isExpired ? 'text-error-600' : 'text-warning-600'
        }`}
      >
        {formatTimeRemaining(timeRemaining)}
      </span>
    </div>
  );
}

