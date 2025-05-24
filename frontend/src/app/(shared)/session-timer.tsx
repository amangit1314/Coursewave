import React, { useState, useEffect } from 'react';

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      <h1>Time Spent on Platform</h1>
      <p>{formatTime(seconds)}</p>
    </div>
  );
};

export default SessionTimer;
