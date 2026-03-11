"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, X } from "lucide-react";
import { toast } from "sonner";

export default function CalendarClient({ initialData }: any) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [blockedDates, setBlockedDates] = useState<string[]>(initialData.availability?.blocked || []);
    const bookedDates = initialData.bookings || [];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek };
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const isDateBooked = (dateStr: string) => bookedDates.some((d: any) => formatDate(new Date(d.eventDate)) === dateStr);

    const isDateBlocked = (dateStr: string) => blockedDates.includes(dateStr);

    const getEventForDate = (dateStr: string) => bookedDates.find((d: any) => formatDate(new Date(d.eventDate)) === dateStr);

    const handleBlockDate = async () => {
        if (!selectedDate) return;
        const dateStr = formatDate(selectedDate);
        
        if (isDateBlocked(dateStr)) {
            await fetch("/api/vendor/calendar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: dateStr, action: "unblock" }),
            });
            setBlockedDates(blockedDates.filter(d => d !== dateStr));
            toast.success("Date unblocked");
        } else {
            await fetch("/api/vendor/calendar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: dateStr, action: "block" }),
            });
            setBlockedDates([...blockedDates, dateStr]);
            toast.success("Date blocked");
        }
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const upcomingEvents = bookedDates
        .filter((event: any) => new Date(event.eventDate) >= new Date())
        .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        .slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-charcoal mb-2">Calendar</h1>
                <p className="text-gray-600">Manage your availability and upcoming events</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{monthName}</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                                        Today
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
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
                                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
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
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {getEventForDate(formatDate(selectedDate)) ? (
                                    <div className="bg-sand/20 p-4 rounded-lg mb-4">
                                        <p className="text-sm font-semibold text-charcoal mb-2">
                                            Booking: {getEventForDate(formatDate(selectedDate))?.serviceType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Status: {getEventForDate(formatDate(selectedDate))?.status}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 mb-4">
                                        {isDateBlocked(formatDate(selectedDate)) ? "This date is blocked" : "No events scheduled for this date"}
                                    </p>
                                )}
                                <Button 
                                    onClick={handleBlockDate} 
                                    variant="outline" 
                                    className={`w-full ${isDateBlocked(formatDate(selectedDate)) ? "border-green-300 text-green-600 hover:bg-green-50" : "border-red-300 text-red-600 hover:bg-red-50"}`}
                                >
                                    {isDateBlocked(formatDate(selectedDate)) ? "Unblock Date" : "Block Date"}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

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
                                upcomingEvents.map((event: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-sand/20 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-charcoal">{event.serviceType}</h4>
                                            <Badge className={event.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                {event.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                                <span className="text-lg font-bold text-burgundy">
                                    {bookedDates.filter((d: any) => new Date(d.eventDate).getMonth() === currentDate.getMonth()).length} events
                                </span>
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
    );
}
