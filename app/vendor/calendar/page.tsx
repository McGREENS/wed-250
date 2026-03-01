"use client";

import { useState } from "react";
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

export default function VendorCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const bookedDates = [
        { date: "2024-10-24", event: "Sarah & Michael", time: "10:00 AM", venue: "Kigali Serena Hotel", guests: 150 },
        { date: "2024-11-02", event: "Emma & David", time: "2:00 PM", venue: "Heaven Restaurant", guests: 80 },
        { date: "2024-11-15", event: "Jessica & Robert", time: "11:00 AM", venue: "Kigali Convention Centre", guests: 200 },
        { date: "2024-11-28", event: "Linda & James", time: "3:00 PM", venue: "Inzora Rooftop", guests: 50 },
        { date: "2024-12-05", event: "Amanda & Chris", time: "1:00 PM", venue: "Lemigo Hotel", guests: 120 }
    ];

    const blockedDates = ["2024-10-30", "2024-11-10", "2024-12-25"];

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
        return date.toISOString().split('T')[0];
    };

    const isDateBooked = (dateStr: string) => {
        return bookedDates.some(d => d.date === dateStr);
    };

    const isDateBlocked = (dateStr: string) => {
        return blockedDates.includes(dateStr);
    };

    const getEventForDate = (dateStr: string) => {
        return bookedDates.find(d => d.date === dateStr);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
    };

    const handleMarkAsBooked = () => {
        if (selectedDate) {
            toast.success(`${selectedDate.toLocaleDateString()} marked as booked`);
        }
    };

    const handleMarkAsFree = () => {
        if (selectedDate) {
            toast.success(`${selectedDate.toLocaleDateString()} marked as available`);
        }
    };

    const handleBlockDate = () => {
        if (selectedDate) {
            toast.success(`${selectedDate.toLocaleDateString()} blocked`);
        }
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const upcomingEvents = bookedDates
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <VendorPageLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-charcoal mb-2">Calendar</h1>
                        <p className="text-gray-600">Manage your availability and upcoming events</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Calendar */}
                        <div className="lg:col-span-2">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{monthName}</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleNextMonth}>
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-7 gap-2 mb-2">
                                        {weekDays.map(day => (
                                            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square" />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                                            const isBooked = isDateBooked(dateStr);
                                            const isBlocked = isDateBlocked(dateStr);
                                            const isSelected = selectedDate && formatDate(selectedDate) === dateStr;
                                            const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => handleDateClick(day)}
                                                    className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all ${
                                                        isSelected
                                                            ? "bg-burgundy text-white ring-2 ring-burgundy ring-offset-2"
                                                            : isBooked
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : isBlocked
                                                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                            : isPast
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "bg-white border border-gray-200 hover:border-burgundy hover:bg-burgundy/5"
                                                    }`}
                                                    disabled={isPast}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded" />
                                            <span className="text-gray-600">Booked</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded" />
                                            <span className="text-gray-600">Blocked</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-white border border-gray-200 rounded" />
                                            <span className="text-gray-600">Available</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {selectedDate && (
                                <Card className="border-gray-100 shadow-sm mt-6">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">
                                            Manage {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {getEventForDate(formatDate(selectedDate)) ? (
                                            <div className="bg-sand/20 p-4 rounded-lg mb-4">
                                                <p className="text-sm font-semibold text-charcoal mb-2">
                                                    Event: {getEventForDate(formatDate(selectedDate))?.event}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {getEventForDate(formatDate(selectedDate))?.time} • {getEventForDate(formatDate(selectedDate))?.venue}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-600 mb-4">No events scheduled for this date</p>
                                        )}
                                        <div className="flex gap-3">
                                            <Button onClick={handleMarkAsFree} variant="outline" className="flex-1">
                                                Mark as Available
                                            </Button>
                                            <Button onClick={handleBlockDate} variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                                                Block Date
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Upcoming Events */}
                        <div className="space-y-6">
                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {upcomingEvents.length === 0 ? (
                                        <div className="text-center py-8">
                                            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">No upcoming events</p>
                                        </div>
                                    ) : (
                                        upcomingEvents.map((event, idx) => (
                                            <div key={idx} className="p-4 bg-sand/20 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-charcoal">{event.event}</h4>
                                                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{event.venue}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>{event.guests} guests</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">This Month</span>
                                        <span className="text-lg font-bold text-burgundy">{bookedDates.filter(d => new Date(d.date).getMonth() === currentDate.getMonth()).length} events</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Next Month</span>
                                        <span className="text-lg font-bold text-charcoal">{bookedDates.filter(d => new Date(d.date).getMonth() === currentDate.getMonth() + 1).length} events</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Blocked Days</span>
                                        <span className="text-lg font-bold text-red-600">{blockedDates.length}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
        </VendorPageLayout>
    );
}
