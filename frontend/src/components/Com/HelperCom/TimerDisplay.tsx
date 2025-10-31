// TimerDisplay.tsx
import React, { useEffect, useState } from "react";

const TimerDisplay = ({ startTime, endTime,onAuctionEnd }: { startTime: number; endTime: number;onAuctionEnd:()=>void }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, progress: 0 });

  useEffect(() => {

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, progress: 100 });
        if (onAuctionEnd) onAuctionEnd();
        return;
      }

      const hours = Math.floor(remaining / 1000 / 60 / 60);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      const progress = Math.min(
        100,
        Math.max(0, ((now - startTime) / (endTime - startTime)) * 100)
      );

      setTimeLeft({ hours, minutes, seconds, progress });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return (
    <>
      <h2 className="text-3xl font-bold text-glow-purple mb-4">
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </h2>
      <div className="h-2 w-full bg-[#1f2847] rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${timeLeft.progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">
        {Math.floor(timeLeft.progress)}% completed
      </p>
    </>
  );
};

export default React.memo(TimerDisplay);
