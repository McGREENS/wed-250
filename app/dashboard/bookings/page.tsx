"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Calendar, MapPin, Phone, Mail, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function BookingsPage() {
    const [bookings] = useState([
        {
            id: 1,
            vendor: 'Kigali Serena Hotel',
            service: 'Venue',
            date: '2024-12-15',
            time: '2:00 PM - 10:00 PM',
            amount: 'RWF 5,000,000',
            status: 'confirmed',
            paymentStatus: 'deposit_paid',
            depositAmount: 'RWF 2,000,000',
            phone: '+250 788 123 456',
            email: 'events@serenahotel.rw',
            location: 'KN 3 Ave, Kigali',
            notes: 'Includes main hall, garden area, and parking for 150 guests'
        },
        {
            id: 2,
            vendor: 'Pixel Perfect Photography',
            service: 'Photography & Videography',
            date: '2024-12-15',
            time: '12:00 PM - 8:00 PM',
            amount: 'RWF 800,000',
            status: 'pending',
            paymentStatus: 'unpaid',
            depositAmount: 'RWF 0',
            phone: '+250 788 234 567',
            email: 'info@pixelperfect.rw',
            location: 'Kigali, Rwanda',
            notes: 'Full day coverage with 2 photographers and 1 videographer'
        },
        {
            id: 3,
            vendor: 'Bloom & Bliss Decor',
            service: 'Decoration',
            date: '2024-12-15',
            time: '8:00 AM - 2:00 PM',
            amount: 'RWF 1,200,000',
            status: 'confirmed',
            paymentStatus: 'paid',
            depositAmount: 'RWF 1,200,000',
            phone: '+250 788 345 678',
            email: 'hello@bloomandblis.rw',
            location: 'Kimihurura, Kigali',
            notes: 'Floral arrangements, table settings, and ceremony arch'
        },
        {
            id: 4,
            vendor: 'Divine Catering Services',
            service: 'Catering',
            date: '2024-12-15',
            time: '3:00 PM - 9:00 PM',
            amount: 'RWF 2,500,000',
            status: 'completed',
            paymentStatus: 'paid',
            depositAmount: 'RWF 2,500,000',
            phone: '+250 788 456 789',
            email: 'bookings@divinecatering.rw',
            location: 'Nyarutarama, Kigali',
            notes: 'Full buffet service for 150 guests with 3-course meal'
        },
    ]);

    const getPaymentBadge = (status: string) => {
        const styles = {
            paid: 'bg-green-100 text-green-700',
            deposit_paid: 'bg-yellow-100 text-yellow-700',
            unpaid: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles];
    };

    const getStatusIcon = (status: string) => {
        if (status === 'confirmed') return <CheckCircle className="w-5 h-5 text-green-600" />;
        if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-600" />;
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    };

    const filterBookings = (status: string) => {
        return bookings.filter(b => b.status === status);
    };

    const BookingCard = ({ booking }: { booking: any }) => (
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(booking.status)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-charcoal text-lg">{booking.vendor}</h3>
                            <p className="text-sm text-gray-600">{booking.service}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-burgundy text-lg">{booking.amount}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-sand/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium text-charcoal">{new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm font-medium text-charcoal">{booking.time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-charcoal">{booking.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Deposit Paid</p>
                            <p className="text-sm font-medium text-charcoal">{booking.depositAmount}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Booking Notes</p>
                    <p className="text-sm text-gray-700">{booking.notes}</p>
                </div>

                <div className="flex items-center gap-4 mb-4 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 flex-1">
                        <Phone className="w-4 h-4 text-burgundy" />
                        <span className="text-sm text-charcoal">{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <Mail className="w-4 h-4 text-burgundy" />
                        <span className="text-sm text-charcoal">{booking.email}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                        Contact Vendor
                    </Button>
                    {booking.status === 'pending' && (
                        <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Cancel Booking
                        </Button>
                    )}
                    {booking.paymentStatus !== 'paid' && booking.status === 'confirmed' && (
                        <Button className="flex-1 bg-burgundy hover:bg-burgundy-light text-white">
                            Make Payment
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">My Bookings</h1>
                    <p className="text-gray-600">Manage all your vendor bookings in one place</p>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                            <p className="text-2xl font-bold text-charcoal">{bookings.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                            <p className="text-2xl font-bold text-green-600">{filterBookings('confirmed').length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{filterBookings('pending').length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-blue-600">{filterBookings('completed').length}</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="bg-white border border-gray-100">
                        <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({filterBookings('pending').length})</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed ({filterBookings('confirmed').length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({filterBookings('completed').length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        {filterBookings('pending').length > 0 ? (
                            filterBookings('pending').map(booking => <BookingCard key={booking.id} booking={booking} />)
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No pending bookings</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="confirmed" className="space-y-4">
                        {filterBookings('confirmed').length > 0 ? (
                            filterBookings('confirmed').map(booking => <BookingCard key={booking.id} booking={booking} />)
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No confirmed bookings</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        {filterBookings('completed').length > 0 ? (
                            filterBookings('completed').map(booking => <BookingCard key={booking.id} booking={booking} />)
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No completed bookings</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </UserPageLayout>
    );
}
