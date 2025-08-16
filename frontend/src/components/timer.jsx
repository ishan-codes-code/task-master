import { useState, useEffect } from "react";

// Helper: formats number to always be two digits
export function getTimeLeft(target) {
  const now = new Date();
  const targetDate = new Date(target);
  const diffInMS = targetDate - now;

  if (diffInMS <= 0) {
    return { d: "00", h: "00", m: "00", s: "00", dueText: expired };
  }

  const diffInSec = Math.floor(diffInMS / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHrs = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHrs / 24);

  const format = (n) => String(n).padStart(2, "0");

  const dueText =
    (diffInDays >= 1 && `${diffInDays} days`) ||
    (diffInHrs >= 1 && `${diffInHrs} hours`) ||
    (diffInMin >= 1 && `${diffInMin} minutes`) ||
    (diffInSec >= 1 && `${diffInSec} seconds`);

  return {
    d: format(diffInDays),
    h: format(diffInHrs % 24),
    m: format(diffInMin % 60),
    s: format(diffInSec % 60),
    dueText: dueText,
  };
}

// Animated number component

export default function Timer({ date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="flex items-center justify-center gap-2 text-center m-auto ">
      {/* Days */}
      {timeLeft.d > 0 && (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold">{timeLeft.d}</div>

            <div className="text-[10px]">Days</div>
          </div>
          <div className="timer-colon">:</div>
        </div>
      )}

      {/* Hours */}
      {(timeLeft.h > 0 || timeLeft.d > 0) && (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold">{timeLeft.h}</div>

            <div className="text-[10px]">Hours</div>
          </div>
          <div className="timer-colon">:</div>
        </div>
      )}

      {/* Minutes */}
      {(timeLeft.m > 0 || timeLeft.h > 0) && (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold">{timeLeft.m}</div>

            <div className="text-[10px]">Minutes</div>
          </div>
          <div className="timer-colon">:</div>
        </div>
      )}

      {/* Seconds */}
      {(timeLeft.s > 0 || timeLeft.m > 0) && (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold">{timeLeft.s}</div>
            <div className="text-[10px]">Seconds</div>
          </div>
        </div>
      )}
    </div>
  );
}
