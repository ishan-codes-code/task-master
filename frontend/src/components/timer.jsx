import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper: formats number to always be two digits
function getTimeLeft(target) {
  const now = new Date();
  const targetDate = new Date(target);
  const diffInMS = targetDate - now;

  if (diffInMS <= 0) {
    return { d: "00", h: "00", m: "00", s: "00" };
  }

  const diffInSec = Math.floor(diffInMS / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHrs = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHrs / 24);

  const format = (n) => String(n).padStart(2, "0");

  return {
    d: format(diffInDays),
    h: format(diffInHrs % 24),
    m: format(diffInMin % 60),
    s: format(diffInSec % 60),
  };
}

// Animated number component
function AnimatedNumber({ value }) {
  return (
    <motion.div
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="timer-numbers rounded-md font-bold"
    >
      {value}
    </motion.div>
  );
}

export default function Timer({ date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <AnimatePresence mode="wait">
      <div className="flex items-center gap-2 text-center">
        {/* Days */}
        <div className="flex items-center gap-2">
          <div>
            <div>{timeLeft.d}</div>
            <div className="text-[10px]">days</div>
          </div>
          <div className="timer-colon">:</div>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-2">
          <div>
            <div>{timeLeft.h}</div>
            <div className="text-[10px]">hours</div>
          </div>
          <div className="timer-colon">:</div>
        </div>

        {/* Minutes */}
        <div className="flex items-center gap-2">
          <div>
            <div>{timeLeft.m}</div>
            <div className="text-[10px]">minutes</div>
          </div>
          <div className="timer-colon">:</div>
        </div>

        {/* Seconds */}
        <div className="flex items-center gap-2">
          <div>
            <div>{timeLeft.s}</div>
            <div className="text-[10px]">seconds</div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
