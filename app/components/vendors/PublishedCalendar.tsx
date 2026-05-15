"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface PublishedCalendarProps {
  vendorId: string;
}

export default function PublishedCalendar({ vendorId }: PublishedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch(`/api/vendors/${vendorId}/calendar`);
        if (res.ok) {
          const data = await res.json();
          console.log("Calendar data received:", data);
          console.log("Bookings:", data.bookings);
          console.log("Availability:", data.availability);
          setAvailability(data.availability || { blocked: [] });
          setBookings(data.bookings || []);
        } else {
          console.error("Failed to fetch calendar:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Error fetching calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [vendorId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateBooked = (dateStr: string) => {
    const result = bookings.some((d: any) => {
      if (!d.eventDate) return false;
      const storedDate = new Date(d.eventDate);
      const storedDateStr = formatDate(storedDate);
      const isMatch = storedDateStr === dateStr;
      if (isMatch) {
        console.log(`Date ${dateStr} is booked (eventDate: ${d.eventDate})`);
      }
      return isMatch;
    });
    return result;
  };

  const isDateBlocked = (dateStr: string) => {
    const result = availability?.blocked?.includes(dateStr) || false;
    if (result) {
      console.log(`Date ${dateStr} is blocked`);
    }
    return result;
  };

  if (loading) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading calendar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Availability
          </CardTitle>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{monthName}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const isBooked = isDateBooked(dateStr);
            const isBlocked = isDateBlocked(dateStr);
            const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center text-xs font-medium rounded transition-colors ${
                  isBooked
                    ? "bg-green-100 text-green-800"
                    : isBlocked
                    ? "bg-red-100 text-red-800"
                    : isPast
                    ? "text-gray-300 bg-gray-50"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" />
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded" />
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded" />
            <span className="text-gray-600">Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
