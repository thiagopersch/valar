'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
      {format(currentTime, 'HH:mm:ss')}
    </div>
  );
}
