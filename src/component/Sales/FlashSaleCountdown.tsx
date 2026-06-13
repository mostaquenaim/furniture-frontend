"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: Date): TimeLeft | null {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface FlashSaleCountdownProps {
  endDate: Date;
  label?: string;
}

export default function FlashSaleCountdown({
  endDate,
  label = "Sale ends in",
}: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(endDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  const segments = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-red-100 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[56px] text-center">
                <span className="text-3xl font-bold tabular-nums text-white">
                  {pad(seg.value)}
                </span>
              </div>
              <span className="text-xs text-red-200 mt-1 uppercase tracking-wider">
                {seg.label}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span className="text-white text-2xl font-bold mb-4 select-none">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
