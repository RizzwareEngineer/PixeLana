import React, { useState, useEffect } from 'react';

export const Timer = ({ timeLeft, setTimeLeft}: {timeLeft:number, setTimeLeft: (x:number) => void}) => {
  // const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Exit early when we reach 0
    if (!timeLeft) return;

    // Save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Add timeLeft as a dependency to re-run the effect
    // when we update it
  }, [timeLeft]);

  return (
    <div>
      <h1>Time Remaining: {timeLeft}</h1>
    </div>
  );
};

export default Timer;
