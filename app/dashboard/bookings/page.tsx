"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, MapPin, Phone, Mail, DollarSign, Clock, CheckCircle, AlertCircle, Heart, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [venueTours, setVenueTours] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, toursRes, favoritesRes] = await Promise.all([
                    fetch('/api/bookings'),
                    fetch('/api/venue-tours'),
                    fetch('/api/favorites')
                ]);
                
                const bookingsData = await bookingsRes.json();
                const toursData = await toursRes.json();
                const favoritesData = await favoritesRes.json();
                
                setBookings(bookingsData.bookings || []);
                setVenueTours(toursData.tours || []);
                setFavorites(favoritesData.favorites || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            CONFIRMED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
            COMPLETED: 'bg-blue-100 text-blue-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const VenueTourCard = ({ tour }: { tour: any }) => (
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Eye className="w-6 h-6 text-burgundy" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-charcoal text-lg">{tour.venueName || 'Venue Tour Request'}</h3>
                            <p className="text-sm text-gray-600">Scheduled venue visit</p>
                        </div>
                    </div>
                    <Badge className={getStatusBadge(tour.status)}>
                        {tour.status}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-sand/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Tour Date</p>
                            <p className="text-sm font-medium text-charcoal">
                                {new Date(tour.tourDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Tour Time</p>
                            <p className="text-sm font-medium text-charcoal">{tour.tourTime}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Contact Information</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-burgundy" />
                            <span className="text-sm text-charcoal">{tour.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-burgundy" />
                            <span className="text-sm text-charcoal">{tour.phone}</span>
                        </div>
                    </div>
                </div>

                {tour.notes && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{tour.notes}</p>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                        onClick={() => router.push(`/venues/${tour.venueId}`)}
                    >
                        View Venue
                    </Button>
                    {tour.status === 'PENDING' && (
                        <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Cancel Tour
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const getPaymentBadge = (status: string) => {
        const styles = {
            PAID: 'bg-green-100 text-green-700',
            DEPOSIT_PAID: 'bg-yellow-100 text-yellow-700',
            UNPAID: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
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
                            <h3 className="font-semibold text-charcoal text-lg">{booking.vendorName || 'Vendor'}</h3>
                            <p className="text-sm text-gray-600">{booking.serviceType || booking.servicePackage}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-burgundy text-lg">{booking.amount?.toLocaleString() || booking.totalAmount?.toLocaleString()} RWF</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-sand/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Event Date</p>
                            <p className="text-sm font-medium text-charcoal">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Booked On</p>
                            <p className="text-sm font-medium text-charcoal">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-charcoal">{booking.vendorLocation || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Deposit Paid</p>
                            <p className="text-sm font-medium text-charcoal">{booking.depositAmount?.toLocaleString() || 0} RWF</p>
                        </div>
                    </div>
                </div>

                {booking.notes && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Booking Notes</p>
                        <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-4 p-3 bg-white rounded-lg border border-gray-100">
                    {booking.vendorPhone && (
                        <div className="flex items-center gap-2 flex-1">
                            <Phone className="w-4 h-4 text-burgundy" />
                            <span className="text-sm text-charcoal">{booking.vendorPhone}</span>
                        </div>
                    )}
                    {booking.vendorEmail && (
                        <div className="flex items-center gap-2 flex-1">
                            <Mail className="w-4 h-4 text-burgundy" />
                            <span className="text-sm text-charcoal">{booking.vendorEmail}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                        onClick={() => router.push(`/vendors/${booking.vendorId}`)}
                    >
                        View Vendor
                    </Button>
                    {booking.status === 'pending' && (
                        <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Cancel Booking
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const FavoriteCard = ({ favorite }: { favorite: any }) => {
        const images = favorite.vendorImages ? JSON.parse(favorite.vendorImages) : [];
        const categories = favorite.vendorCategories ? JSON.parse(favorite.vendorCategories) : [];
        
        return (
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    {images[0] && (
                        <img src={images[0]} alt={favorite.vendorName} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-charcoal text-lg">{favorite.vendorName}</h3>
                                <p className="text-sm text-gray-600">{categories.join(', ')}</p>
                            </div>
                            <Heart className="w-5 h-5 text-burgundy fill-burgundy" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{favorite.vendorLocation}</span>
                        </div>
                        {favorite.vendorPriceRange && (
                            <p className="text-burgundy font-semibold mb-3">{favorite.vendorPriceRange}</p>
                        )}
                        <Button 
                            className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                            onClick={() => router.push(`/vendors/${favorite.vendorId}`)}
                        >
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <UserPageLayout>
                <LoadingSpinner size="lg" text="Loading your bookings..." />
            </UserPageLayout>
        );
    }

    return (
        <UserPageLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">My Bookings & Tours</h1>
                    <p className="text-gray-600">Manage all your vendor bookings, venue tours and saved items</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border border-gray-100">
                        <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
                        <TabsTrigger value="tours">Venue Tours ({venueTours.length})</TabsTrigger>
                        <TabsTrigger value="favorites">Saved ({favorites.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-6">
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

                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                            </div>
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No bookings yet</p>
                                    <Button 
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        onClick={() => router.push('/vendors')}
                                    >
                                        Browse Vendors
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="tours" className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-600 mb-1">Total Tours</p>
                                    <p className="text-2xl font-bold text-charcoal">{venueTours.length}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{venueTours.filter(t => t.status === 'PENDING').length}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                                    <p className="text-2xl font-bold text-green-600">{venueTours.filter(t => t.status === 'CONFIRMED').length}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                                    <p className="text-2xl font-bold text-blue-600">{venueTours.filter(t => t.status === 'COMPLETED').length}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {venueTours.length > 0 ? (
                            <div className="space-y-4">
                                {venueTours.map(tour => <VenueTourCard key={tour.id} tour={tour} />)}
                            </div>
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No venue tours scheduled yet</p>
                                    <Button 
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        onClick={() => router.push('/venues')}
                                    >
                                        Browse Venues
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="favorites" className="space-y-6">
                        {favorites.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {favorites.map(favorite => <FavoriteCard key={favorite.id} favorite={favorite} />)}
                            </div>
                        ) : (
                            <Card className="border-gray-100">
                                <CardContent className="p-12 text-center">
                                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No saved vendors or venues yet</p>
                                    <Button 
                                        className="bg-burgundy hover:bg-burgundy-light text-white"
                                        onClick={() => router.push('/vendors')}
                                    >
                                        Browse Vendors
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </UserPageLayout>
    );
}