"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Heart, Eye, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import PaymentPanel from '@/app/components/dashboard/PaymentPanel';
import PaymentHistory from '@/app/components/dashboard/PaymentHistory';
import PaymentProgress from '@/app/components/dashboard/PaymentProgress';
import DiscoverBanner from '@/app/components/dashboard/DiscoverBanner';
import { toast } from 'sonner';

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
            PENDING: 'bg-burgundy/10 text-burgundy',
            CONFIRMED: 'bg-gold/25 text-charcoal',
            CANCELLED: 'bg-charcoal/10 text-charcoal/70',
            COMPLETED: 'bg-sand text-charcoal',
        };
        return styles[status as keyof typeof styles] || 'bg-sand text-charcoal/70';
    };

    const VenueTourCard = ({ tour }: { tour: any }) => (
        <Card className="border-burgundy/15 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-burgundy/6 via-cream to-sand/30 overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Eye className="w-6 h-6 text-burgundy" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-charcoal text-lg">{tour.venueName || 'Venue Tour Request'}</h3>
                            <p className="text-sm text-charcoal/70">Scheduled venue visit</p>
                        </div>
                    </div>
                    <Badge className={getStatusBadge(tour.status)}>
                        {tour.status}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-sand/40 border border-sand rounded-xl">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-burgundy/70" />
                        <div>
                            <p className="text-xs text-charcoal/60">Tour Date</p>
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
                        <Clock className="w-4 h-4 text-burgundy/70" />
                        <div>
                            <p className="text-xs text-charcoal/60">Tour Time</p>
                            <p className="text-sm font-medium text-charcoal">{tour.tourTime}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-4 p-3 bg-cream rounded-xl border border-sand">
                    <p className="text-xs text-charcoal/60 mb-2">Contact Information</p>
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
                        <p className="text-xs text-charcoal/60 mb-1">Notes</p>
                        <p className="text-sm text-charcoal/80">{tour.notes}</p>
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
                        <Button variant="outline" className="flex-1 border-burgundy-light text-burgundy-light hover:bg-burgundy-light hover:text-white">
                            Cancel Tour
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const getPaymentBadge = (status: string) => {
        const styles = {
            PAID: 'bg-gold/25 text-charcoal',
            DEPOSIT_PAID: 'bg-burgundy/10 text-burgundy',
            UNPAID: 'bg-sand text-charcoal/70',
        };
        return styles[status as keyof typeof styles] || 'bg-sand text-charcoal/70';
    };

    const getStatusIcon = (status: string) => {
        if (status === 'confirmed') return <CheckCircle className="w-5 h-5 text-gold" />;
        if (status === 'pending') return <Clock className="w-5 h-5 text-burgundy-light" />;
        return <AlertCircle className="w-5 h-5 text-charcoal" />;
    };

    const filterBookings = (status: string) => {
        return bookings.filter(b => b.status === status);
    };

    const statCards = {
        bookings: [
            { label: 'Total Bookings', value: bookings.length, cardClass: 'border-burgundy/20 bg-gradient-to-br from-burgundy/12 via-burgundy/5 to-cream', valueClass: 'text-charcoal' },
            { label: 'Confirmed', value: filterBookings('confirmed').length, cardClass: 'border-gold/25 bg-gradient-to-br from-gold/15 via-gold/5 to-cream', valueClass: 'text-gold' },
            { label: 'Pending', value: filterBookings('pending').length, cardClass: 'border-sand bg-gradient-to-br from-sand via-sand/60 to-cream', valueClass: 'text-burgundy-light' },
            { label: 'Completed', value: filterBookings('completed').length, cardClass: 'border-charcoal/10 bg-gradient-to-br from-charcoal/5 via-sand/40 to-cream', valueClass: 'text-charcoal' },
        ],
        tours: [
            { label: 'Total Tours', value: venueTours.length, cardClass: 'border-burgundy/20 bg-gradient-to-br from-burgundy/12 via-burgundy/5 to-cream', valueClass: 'text-charcoal' },
            { label: 'Pending', value: venueTours.filter(t => t.status === 'PENDING').length, cardClass: 'border-sand bg-gradient-to-br from-sand via-sand/60 to-cream', valueClass: 'text-burgundy-light' },
            { label: 'Confirmed', value: venueTours.filter(t => t.status === 'CONFIRMED').length, cardClass: 'border-gold/25 bg-gradient-to-br from-gold/15 via-gold/5 to-cream', valueClass: 'text-gold' },
            { label: 'Completed', value: venueTours.filter(t => t.status === 'COMPLETED').length, cardClass: 'border-charcoal/10 bg-gradient-to-br from-charcoal/5 via-sand/40 to-cream', valueClass: 'text-charcoal' },
        ],
    };

    const BookingCard = ({ booking }: { booking: any }) => {
        const totalAmount = booking.totalAmount || booking.amount || 0;
        const [totalPaid, setTotalPaid] = useState<number>(booking.depositAmount || 0);
        const [paymentStatus, setPaymentStatus] = useState<string>(booking.paymentStatus || 'UNPAID');
        const [refreshTrigger, setRefreshTrigger] = useState(0);
        const [showPayments, setShowPayments] = useState(false);
        const [bookingStatus, setBookingStatus] = useState<string>(booking.status);
        const [cancelling, setCancelling] = useState(false);
        const [confirmCancel, setConfirmCancel] = useState(false);

        const handleCancelBooking = async () => {
            setCancelling(true);
            try {
                const res = await fetch('/api/bookings', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: booking.id }),
                });
                if (res.ok) {
                    setBookingStatus('cancelled');
                    toast.success('Booking cancelled successfully');
                } else {
                    toast.error('Failed to cancel booking');
                }
            } catch {
                toast.error('Failed to cancel booking');
            } finally {
                setCancelling(false);
                setConfirmCancel(false);
            }
        };

        const handlePaymentAdded = (newTotalPaid: number, newStatus: string) => {
            setTotalPaid(newTotalPaid);
            setPaymentStatus(newStatus);
            setRefreshTrigger(t => t + 1);
            setShowPayments(true);
        };

        const handlePaymentDeleted = (newTotalPaid: number, newStatus: string) => {
            setTotalPaid(newTotalPaid);
            setPaymentStatus(newStatus);
        };

        return (
            <Card className="border-gold/20 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-gold/8 via-cream to-sand/30 overflow-hidden">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-burgundy/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                {getStatusIcon(booking.status)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-charcoal text-lg">{booking.vendorName || 'Vendor'}</h3>
                                <p className="text-sm text-charcoal/70">{booking.serviceType || booking.servicePackage}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-burgundy text-lg">{totalAmount.toLocaleString()} RWF</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getPaymentBadge(paymentStatus)}`}>
                                {paymentStatus?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Booking details grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-sand/40 border border-sand rounded-xl">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-burgundy/70" />
                            <div>
                                <p className="text-xs text-charcoal/60">Event Date</p>
                                <p className="text-sm font-medium text-charcoal">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-burgundy/70" />
                            <div>
                                <p className="text-xs text-charcoal/60">Booked On</p>
                                <p className="text-sm font-medium text-charcoal">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-burgundy/70" />
                            <div>
                                <p className="text-xs text-charcoal/60">Location</p>
                                <p className="text-sm font-medium text-charcoal">{booking.vendorLocation || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-burgundy/70" />
                            <div>
                                <p className="text-xs text-charcoal/60">Booking Status</p>
                                <p className="text-sm font-medium text-charcoal capitalize">{booking.status}</p>
                            </div>
                        </div>
                    </div>

                    {booking.notes && (
                        <div className="mb-4">
                            <p className="text-xs text-charcoal/60 mb-1">Booking Notes</p>
                            <p className="text-sm text-charcoal/80">{booking.notes}</p>
                        </div>
                    )}

                    {(booking.vendorPhone || booking.vendorEmail) && (
                        <div className="flex items-center gap-4 mb-4 p-3 bg-cream rounded-xl border border-sand">
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
                    )}

                    {/* ── Payment section ── */}
                    {totalAmount > 0 && (
                        <div className="border-t border-sand pt-4 mt-2">
                            {/* Payment Progress */}
                            <PaymentProgress
                                totalAmount={totalAmount}
                                totalPaid={totalPaid}
                                paymentStatus={paymentStatus}
                            />

                            {/* Add Payment form */}
                            <PaymentPanel
                                bookingId={booking.id}
                                totalAmount={totalAmount}
                                totalPaid={totalPaid}
                                onPaymentAdded={handlePaymentAdded}
                            />

                            {/* Payment History toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPayments(v => !v)}
                                className="flex items-center justify-between w-full mt-3 px-4 py-2.5 rounded-lg border border-sand bg-sand/30 hover:bg-sand/50 transition-colors text-sm font-medium text-charcoal/70"
                            >
                                <span>Payment History</span>
                                {showPayments
                                    ? <ChevronUp className="w-4 h-4" />
                                    : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showPayments && (
                                <div className="mt-2">
                                    <PaymentHistory
                                        bookingId={booking.id}
                                        refreshTrigger={refreshTrigger}
                                        onPaymentDeleted={handlePaymentDeleted}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                            onClick={() => router.push(`/vendors/${booking.vendorId}`)}
                        >
                            View Vendor
                        </Button>
                        {(bookingStatus === 'pending' || bookingStatus === 'confirmed') && (
                            confirmCancel ? (
                                <div className="flex gap-2 flex-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-gray-300 text-charcoal/70 hover:bg-gray-100"
                                        onClick={() => setConfirmCancel(false)}
                                        disabled={cancelling}
                                    >
                                        Keep
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                        onClick={handleCancelBooking}
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => setConfirmCancel(true)}
                                >
                                    <XCircle className="w-4 h-4 mr-1.5" />
                                    Cancel Booking
                                </Button>
                            )
                        )}
                        {bookingStatus === 'cancelled' && (
                            <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-charcoal/50 text-sm">
                                <XCircle className="w-4 h-4" />
                                Cancelled
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const FavoriteCard = ({ favorite }: { favorite: any }) => {
        const images = favorite.vendorImages ? JSON.parse(favorite.vendorImages) : [];
        const categories = favorite.vendorCategories ? JSON.parse(favorite.vendorCategories) : [];
        
        return (
            <Card className="border-burgundy/15 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-burgundy/5 via-cream to-sand/25 overflow-hidden">
                <CardContent className="p-0">
                    {images[0] && (
                        <img src={images[0]} alt={favorite.vendorName} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-charcoal text-lg">{favorite.vendorName}</h3>
                                <p className="text-sm text-charcoal/70">{categories.join(', ')}</p>
                            </div>
                            <Heart className="w-5 h-5 text-burgundy fill-burgundy" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-burgundy/70" />
                            <span className="text-sm text-charcoal/70">{favorite.vendorLocation}</span>
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
                    <p className="text-charcoal/70">Manage all your vendor bookings, venue tours and saved items</p>
                </div>

                <DiscoverBanner />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-sand/40 border border-sand p-1">
                        <TabsTrigger value="bookings" className="data-[state=active]:bg-cream data-[state=active]:text-burgundy">Bookings ({bookings.length})</TabsTrigger>
                        <TabsTrigger value="tours" className="data-[state=active]:bg-cream data-[state=active]:text-burgundy">Venue Tours ({venueTours.length})</TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:bg-cream data-[state=active]:text-burgundy">Saved ({favorites.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            {statCards.bookings.map((stat) => (
                                <Card key={stat.label} className={`shadow-sm overflow-hidden ${stat.cardClass}`}>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-charcoal/70 mb-1">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                            </div>
                        ) : (
                            <Card className="border-sand shadow-sm bg-gradient-to-br from-sand/40 via-cream to-sand/20">
                                <CardContent className="p-12 text-center">
                                    <Calendar className="w-12 h-12 text-burgundy/40 mx-auto mb-4" />
                                    <p className="text-charcoal/70 mb-4">No bookings yet</p>
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
                            {statCards.tours.map((stat) => (
                                <Card key={stat.label} className={`shadow-sm overflow-hidden ${stat.cardClass}`}>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-charcoal/70 mb-1">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {venueTours.length > 0 ? (
                            <div className="space-y-4">
                                {venueTours.map(tour => <VenueTourCard key={tour.id} tour={tour} />)}
                            </div>
                        ) : (
                            <Card className="border-burgundy/15 shadow-sm bg-gradient-to-br from-burgundy/6 via-cream to-sand/30">
                                <CardContent className="p-12 text-center">
                                    <Eye className="w-12 h-12 text-burgundy/40 mx-auto mb-4" />
                                    <p className="text-charcoal/70 mb-4">No venue tours scheduled yet</p>
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
                            <Card className="border-gold/20 shadow-sm bg-gradient-to-br from-gold/10 via-cream to-sand/30">
                                <CardContent className="p-12 text-center">
                                    <Heart className="w-12 h-12 text-burgundy/40 mx-auto mb-4" />
                                    <p className="text-charcoal/70 mb-4">No saved vendors or venues yet</p>
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