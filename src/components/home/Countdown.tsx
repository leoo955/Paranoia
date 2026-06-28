"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Target: July 3rd 2026
    const targetDate = new Date("2026-07-03T00:00:00+02:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-12 flex flex-col items-center bg-black/40 backdrop-blur-sm border border-red-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.1)] w-full sm:w-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-red-500 animate-pulse" />
        <h3 className="text-lg md:text-xl font-bold text-red-400 uppercase tracking-widest text-center">Avant la dictature de Phorealc</h3>
      </div>
      <div className="flex gap-2 sm:gap-6 text-center">
        {[
          { label: "Jours", value: timeLeft.days },
          { label: "Heures", value: timeLeft.hours },
          { label: "Min", value: timeLeft.minutes },
          { label: "Sec", value: timeLeft.seconds },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/50 border border-red-500/30 rounded-xl flex items-center justify-center mb-2 shadow-inner">
              <span className="text-xl sm:text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] font-mono">
                {item.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-sm text-gray-400 uppercase font-bold tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
