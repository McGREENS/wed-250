"use client";

import { useState } from "react";
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, MapPin, Users, DollarSign, Clock, Mail, Phone, CheckCircle, XCircle, Eye } from "lucide-react";

export default function VendorBookingsPage() {
    const [activeTab, setActiveTab] = useState("pending");

    const bookings = [
        {
            id: 1,
            couple: "Sarah & Michael Johnson",
            email: "sarah.johnson@email.com",
            phone: "+250 788 123 456",
            weddingDate: "2024-12-15",
            startTime: "10:00 AM",
            guests: 150,
            package: "Full Day Wedding Coverage",
            addOns: ["Second Photographer", "Drone Videography"],
            total: 3450,
            status: "pending",
            requestDate: "2024-10-20",
            venue: "Kigali Serena Hotel",
            message: "We're looking for a photographer who can capture both traditional and modern moments. We love candid shots and natural lighting."
        },
        {
            id: 2,
            couple: "Emma & David Williams",
            email: "emma.w@email.com",
            phone: "+250 788 234 567",
            weddingDate: "2024-11-28",
            startTime: "2:00 PM",
            guests: 80,
            package: "Essential Half Day",
            addOns: ["Engagement Session"],
            total: 1900,
            status: "pending",
            requestDate: "2024-10-18",
            venue: "Heaven Restaurant",
            message: "Small intimate wedding with close family. We'd love to have an engagement session before the big day."
        },
        {
            id: 3,
            couple: "Jessica & Robert Brown",
            email: "jess.brown@email.com",
            phone: "+250 788 345 678",
            weddingDate: "2024-10-30",
            startTime: "11:00 AM",
            guests: 200,
            package: "Full Day Wedding Coverage",
            addOns: ["Second Photographer", "Express Delivery"],
            total: 3350,
            status: "confirmed",
            requestDate: "2024-09-15",
            venue: "Kigali Convention Centre",
            message: "Large wedding with multiple events throughout the day. Need comprehensive coverage."
        },
        {
            id: 4,
            couple: "Linda & James Taylor",
            email: "linda.taylor@email.com",
            phone: "+250 788 456 789",
            weddingDate: "2024-11-10",
            startTime: "3:00 PM",
            guests: 50,
            package: "Elopement Special",
            addOns: [],
            total: 950,
            status: "confirmed",
            requestDate: "2024-09-20",
            venue: "Inzora Rooftop Café",
            message: "Just the two of us with a few close friends. Looking for intimate, romantic shots."
        },
        {
            id: 5,
            couple: "Amanda & Chris Wilson",
            email: "amanda.w@email.com",
            phone: "+250 788 567 890",
            weddingDate: "2024-09-25",
            startTime: "1:00 PM",
            guests: 120,
            package: "Full Day Wedding Coverage",
            addOns: ["Second Photographer"],
            total: 3100,
            status: "completed",
            requestDate: "2024-07-10",
            venue: "Lemigo Hotel",
            message: "Garden wedding with lakeside ceremony. Love natural outdoor photography."
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "confirmed": return "bg-green-100 text-green-800";
            case "completed": return "bg-blue-100 text-blue-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const filteredBookings = bookings.filter(b => b.status === activeTab);

    const handleAccept = (id: number) => {
        console.log("Accept booking:", id);
    };

    const handleDecline = (id: number) => {
        console.log("Decline booking:", id);
    };

    return (
        <VendorPageLayout>
            <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-charcoal mb-2">Booking Requests</h1>
                        <p className="text-gray-600">Manage your wedding bookings and client requests</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-white border border-gray-100 mb-6">
                            <TabsTrigger value="pending">
                                Pending ({bookings.filter(b => b.status === "pending").length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed">
                                Confirmed ({bookings.filter(b => b.status === "confirmed").length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({bookings.filter(b => b.status === "completed").length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4">
                            {filteredBookings.length === 0 ? (
                                <Card className="border-gray-100">
                                    <CardContent className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-charcoal mb-2">No {activeTab} bookings</h3>
                                        <p className="text-gray-600">You don't have any {activeTab} bookings at the moment.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <Card key={booking.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-charcoal mb-1">{booking.couple}</h3>
                                                    <Badge className={getStatusColor(booking.status)}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-burgundy">RWF {(booking.total * 1300).toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">Requested {new Date(booking.requestDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-burgundy" />
                                                    <div>
                                                        <p className="text-gray-500 text-xs">Wedding Date</p>
                                                        <p className="font-medium text-charcoal">{new Date(booking.weddingDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4 text-burgundy" />
                                                    <div>
                                                        <p className="text-gray-500 text-xs">Start Time</p>
                                                        <p className="font-medium text-charcoal">{booking.startTime}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-burgundy" />
                                                    <div>
                                                        <p className="text-gray-500 text-xs">Guests</p>
                                                        <p className="font-medium text-charcoal">{booking.guests} people</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-burgundy" />
                                                    <div>
                                                        <p className="text-gray-500 text-xs">Venue</p>
                                                        <p className="font-medium text-charcoal">{booking.venue}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-sand/20 p-4 rounded-lg mb-4">
                                                <p className="text-sm font-semibold text-charcoal mb-2">Package: {booking.package}</p>
                                                {booking.addOns.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-xs text-gray-600">Add-ons:</span>
                                                        {booking.addOns.map((addOn, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                {addOn}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-charcoal mb-2">Client Message:</p>
                                                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                                                    {booking.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{booking.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{booking.phone}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {booking.status === "pending" && (
                                                    <>
                                                        <Button 
                                                            onClick={() => handleAccept(booking.id)}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Accept Booking
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleDecline(booking.id)}
                                                            variant="outline"
                                                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                                {booking.status === "confirmed" && (
                                                    <Button variant="outline" className="flex-1 border-burgundy text-burgundy">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                )}
                                                {booking.status === "completed" && (
                                                    <Button variant="outline" className="flex-1">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
        </VendorPageLayout>
    );
}
