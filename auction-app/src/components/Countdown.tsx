import { useEffect, useState } from 'react';
import { getTimeRemaining } from '../utils/helpers';

interface CountdownProps {
  expiresAt: string;
}

const Countdown = ({ expiresAt }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.total <= 0) {
    return <span className="text-red-600 font-medium">Expired</span>;
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (days > 0) {
    return <span>{days}d {hours}h {minutes}m</span>;
  }
  if (hours > 0) {
    return <span className="text-orange-600">{hours}h {minutes}m {seconds}s</span>;
  }
  return <span className="text-red-600 font-semibold">{minutes}m {seconds}s</span>;
};

export default Countdown;
