import React, { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { Card, CardContent } from "@/app/components/ui/card";

export default function WeddingCountdown({ weddingDate, coupleNames }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(weddingDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-burgundy/10 to-gold/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-burgundy rounded-full opacity-10 blur-2xl" />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-burgundy fill-current" />
          <h3 className="text-lg font-semibold text-charcoal">
            Countdown to Your Big Day
          </h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {coupleNames}'s Wedding
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {new Date(weddingDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="text-2xl font-bold text-burgundy">
                  {item.value.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}