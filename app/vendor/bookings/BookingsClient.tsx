'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Plus, Edit2, Trash2, Phone, Mail, DollarSign, MapPin, Clock, CheckCircle, XCircle, Eye, Loader2, ChevronLeft, ChevronRight, MessageSquare, Users, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';
import { toast } from 'sonner';

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  eventDate: number;
  eventType: string;
  servicePackage: string | null;
  totalAmount: number | null;
  depositAmount: number | null;
  status: string;
  notes: string | null;
  createdAt?: number;
}

interface VenueTour {
  id: string;
  venueId: string;
  venueName: string | null;
  name: string;
  email: string;
  phone: string;
  tourDate: string | number;
  tourTime: string;
  status: string;
  notes: string | null;
  createdAt: string | number;
}

export default function BookingsClient({ initialBookings, initialTours, initialQuotes }: {
  initialBookings: Booking[];
  initialTours: VenueTour[];
  initialQuotes: Booking[];
}) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'bookings' | 'tours' | 'quotes'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [tours, setTours] = useState<VenueTour[]>(initialTours);
  const [quotes, setQuotes] = useState<Booking[]>(initialQuotes);
  const [updatingQuoteId, setUpdatingQuoteId] = useState<string | null>(null);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [acceptingQuote, setAcceptingQuote] = useState<Booking | null>(null);
  const [decliningQuote, setDecliningQuote] = useState<Booking | null>(null);
  const [acceptForm, setAcceptForm] = useState({ totalAmount: '', depositAmount: '', servicePackage: '' });
  const [declineReason, setDeclineReason] = useState('');
  const [updatingTourId, setUpdatingTourId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: 'Wedding',
    servicePackage: '',
    totalAmount: '',
    depositAmount: '',
    notes: '',
  });

  useEffect(() => {
    const date = searchParams.get('date');
    if (date) {
      setFormData(prev => ({ ...prev, eventDate: date }));
      setShowDialog(true);
    }
  }, []);

  useEffect(() => {
    if (showDialog) {
      fetch('/api/vendor/calendar')
        .then(r => r.json())
        .then(d => setBlockedDates(d.availability?.blocked || []));
      setCalendarMonth(new Date());
    }
  }, [showDialog]);

  const handleTourStatusChange = async (id: string, status: string) => {
    setUpdatingTourId(id);
    try {
      const res = await fetch('/api/venue-tours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setTours(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        if (status === 'CONFIRMED') toast.success('Visit approved — confirmation email sent to client');
        else if (status === 'CANCELLED') toast.success('Visit declined — client has been notified by email');
        else if (status === 'COMPLETED') toast.success('Visit marked as completed');
      } else {
        toast.error(data.error || 'Failed to update visit status');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUpdatingTourId(null);
    }
  };

  const handleAcceptQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingQuote) return;
    setUpdatingQuoteId(acceptingQuote.id);
    try {
      const res = await fetch('/api/vendor/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: acceptingQuote.id,
          quoteAction: 'accept',
          totalAmount: Number(acceptForm.totalAmount),
          depositAmount: acceptForm.depositAmount ? Number(acceptForm.depositAmount) : null,
          servicePackage: acceptForm.servicePackage || acceptingQuote.servicePackage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...acceptingQuote, status: 'confirmed', totalAmount: Number(acceptForm.totalAmount), depositAmount: acceptForm.depositAmount ? Number(acceptForm.depositAmount) : null };
        setQuotes(prev => prev.map(q => q.id === acceptingQuote.id ? updated : q));
        setBookings(prev => [updated, ...prev]);
        toast.success('Quote accepted — client has been notified by email');
        setAcceptingQuote(null);
        setAcceptForm({ totalAmount: '', depositAmount: '', servicePackage: '' });
      } else {
        toast.error(data.error || 'Failed to accept quote');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  const handleDeclineQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningQuote) return;
    setUpdatingQuoteId(decliningQuote.id);
    try {
      const res = await fetch('/api/vendor/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: decliningQuote.id, quoteAction: 'decline', declineReason }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === decliningQuote.id ? { ...q, status: 'cancelled' } : q));
        toast.success('Quote declined — client has been notified by email');
        setDecliningQuote(null);
        setDeclineReason('');
      } else {
        toast.error(data.error || 'Failed to decline quote');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  const getTourStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/vendor/bookings';
      const method = editingBooking ? 'PUT' : 'POST';
      const body = editingBooking
        ? { id: editingBooking.id, ...formData, totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null, depositAmount: formData.depositAmount ? Number(formData.depositAmount) : null }
        : { ...formData, totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null, depositAmount: formData.depositAmount ? Number(formData.depositAmount) : null };

      console.log('Submitting booking:', body);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        if (editingBooking) {
          setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, ...formData, totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null, depositAmount: formData.depositAmount ? Number(formData.depositAmount) : null, eventDate: new Date(formData.eventDate).getTime() } : b));
        } else {
          setBookings([data.booking, ...bookings]);
        }
        setShowDialog(false);
        setEditingBooking(null);
        setFormData({ clientName: '', clientEmail: '', clientPhone: '', eventDate: '', eventType: 'Wedding', servicePackage: '', totalAmount: '', depositAmount: '', notes: '' });
      } else {
        alert('Error: ' + (data.error || 'Failed to save booking'));
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail || '',
      clientPhone: booking.clientPhone || '',
      eventDate: new Date(booking.eventDate).toISOString().split('T')[0],
      eventType: booking.eventType,
      servicePackage: booking.servicePackage || '',
      totalAmount: booking.totalAmount?.toString() || '',
      depositAmount: booking.depositAmount?.toString() || '',
      notes: booking.notes || '',
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/vendor/bookings?id=${confirmDeleteId}`, { method: 'DELETE' });
      if (res.ok) setBookings(bookings.filter(b => b.id !== confirmDeleteId));
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatusId(id);
    try {
      const res = await fetch('/api/vendor/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <VendorPageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2C2C2C]">Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your client bookings and venue visits</p>
          </div>
          {activeTab === 'bookings' && (
            <button
              onClick={() => {
                setEditingBooking(null);
                setFormData({ clientName: '', clientEmail: '', clientPhone: '', eventDate: '', eventType: 'Wedding', servicePackage: '', totalAmount: '', depositAmount: '', notes: '' });
                setShowDialog(true);
              }}
              className="bg-[#8B3A3A] text-white px-6 py-3 rounded-lg hover:bg-[#6d2e2e] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Booking
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bookings' ? 'bg-white text-[#8B3A3A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bookings
            {bookings.length > 0 && (
              <span className="ml-2 bg-[#8B3A3A] text-white text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tours' ? 'bg-white text-[#8B3A3A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Venue Visits
            {tours.filter(t => t.status === 'PENDING').length > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                {tours.filter(t => t.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quotes' ? 'bg-white text-[#8B3A3A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Quote Requests
            {quotes.filter(q => q.status === 'pending').length > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                {quotes.filter(q => q.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6 border border-[#E6E2DD]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">{booking.clientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {booking.clientPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{booking.clientPhone}</span>
                        </div>
                      )}
                      {booking.clientEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{booking.clientEmail}</span>
                        </div>
                      )}
                      {booking.totalAmount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{booking.totalAmount.toLocaleString()} RWF</span>
                          {booking.depositAmount && <span className="text-gray-400">({booking.depositAmount.toLocaleString()} RWF deposit)</span>}
                        </div>
                      )}
                    </div>
                    {booking.servicePackage && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium text-[#2C2C2C]">Service: </span>
                        <span className="text-gray-600">{booking.servicePackage}</span>
                      </div>
                    )}
                    {booking.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">{booking.notes}</div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <div className="relative">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={updatingStatusId === booking.id}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingStatusId === booking.id && (
                        <Loader2 className="w-3 h-3 animate-spin absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" />
                      )}
                    </div>
                    <button onClick={() => handleEdit(booking)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(booking.id)}
                      disabled={deletingId === booking.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      {deletingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E6E2DD]">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet. Create your first booking to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Quote Requests Tab */}
        {activeTab === 'quotes' && (
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow-sm p-6 border border-[#E6E2DD]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">{quote.clientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{new Date(quote.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {quote.clientPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{quote.clientPhone}</span>
                        </div>
                      )}
                      {quote.clientEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{quote.clientEmail}</span>
                        </div>
                      )}
                      {quote.eventType && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#8B3A3A]" />
                          <span>{quote.eventType}</span>
                        </div>
                      )}
                    </div>
                    {quote.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">{quote.notes}</div>
                    )}
                    {quote.createdAt && (
                      <p className="text-xs text-gray-400 mt-3">Requested on {new Date(quote.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  {quote.status === 'pending' && (
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => { setAcceptingQuote(quote); setAcceptForm({ totalAmount: '', depositAmount: '', servicePackage: quote.servicePackage || '' }); }}
                        disabled={updatingQuoteId === quote.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium min-w-[100px] justify-center"
                      >
                        {updatingQuoteId === quote.id
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
                          : <><CheckCircle className="w-4 h-4" /> Accept</>}
                      </button>
                      <button
                        onClick={() => { setDecliningQuote(quote); setDeclineReason(''); }}
                        disabled={updatingQuoteId === quote.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium min-w-[100px] justify-center"
                      >
                        {updatingQuoteId === quote.id
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Declining...</>
                          : <><XCircle className="w-4 h-4" /> Decline</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {quotes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E6E2DD]">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quote requests yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Venue Visits Tab */}
        {activeTab === 'tours' && (
          <div className="grid gap-4">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6 border border-[#E6E2DD]">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">{tour.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTourStatusColor(tour.status)}`}>
                        {tour.status}
                      </span>
                    </div>
                    {tour.venueName && (
                      <div className="flex items-center gap-2 text-sm text-[#8B3A3A] font-medium mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.venueName}</span>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{new Date(tour.tourDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{tour.tourTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{tour.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#8B3A3A]" />
                        <span>{tour.email}</span>
                      </div>
                    </div>
                    {tour.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">{tour.notes}</div>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Requested on {new Date(tour.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {tour.status === 'PENDING' && (
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleTourStatusChange(tour.id, 'CONFIRMED')}
                        disabled={updatingTourId === tour.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {updatingTourId === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleTourStatusChange(tour.id, 'CANCELLED')}
                        disabled={updatingTourId === tour.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {updatingTourId === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Decline
                      </button>
                    </div>
                  )}
                  {tour.status === 'CONFIRMED' && (
                    <div className="ml-6">
                      <button
                        onClick={() => handleTourStatusChange(tour.id, 'COMPLETED')}
                        disabled={updatingTourId === tour.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {updatingTourId === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Mark Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {tours.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E6E2DD]">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No venue visit requests yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C2C2C]">Delete Booking</h3>
                <p className="text-sm text-gray-500">For: <span className="font-medium text-[#2C2C2C]">{bookings.find(b => b.id === confirmDeleteId)?.clientName}</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Are you sure you want to delete this booking?</p>
            <p className="text-sm font-semibold text-red-600 mb-6">⚠ This action is irreversible and cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm"
              >
                Yes, Delete Booking
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-sm focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                    >
                      {formData.eventDate
                        ? new Date(formData.eventDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
                        : <span className="text-gray-400">Select a date</span>}
                    </button>
                    {showDatePicker && (() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const bookedSet = new Set(bookings
                        .filter(b => !editingBooking || b.id !== editingBooking.id)
                        .map(b => new Date(b.eventDate).toISOString().split('T')[0]));
                      const blockedSet = new Set(blockedDates);
                      const today = new Date(); today.setHours(0,0,0,0);
                      return (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-72">
                          <div className="flex items-center justify-between mb-3">
                            <button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-1 hover:bg-gray-100 rounded">
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold">{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-1 hover:bg-gray-100 rounded">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-1">
                            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                              const isBooked = bookedSet.has(dateStr);
                              const isBlocked = blockedSet.has(dateStr);
                              const isPast = new Date(dateStr) < today;
                              const isSelected = formData.eventDate === dateStr;
                              const disabled = isBooked || isBlocked || isPast;
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  disabled={disabled}
                                  title={isBooked ? 'Already booked' : isBlocked ? 'Blocked / Busy' : isPast ? 'Past date' : ''}
                                  onClick={() => { setFormData({ ...formData, eventDate: dateStr }); setShowDatePicker(false); }}
                                  className={`aspect-square text-xs rounded-md font-medium transition-all ${
                                    isSelected ? 'bg-[#8B3A3A] text-white'
                                    : isBooked ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : isBlocked ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                    : isPast ? 'text-gray-300 cursor-not-allowed'
                                    : 'hover:bg-[#8B3A3A]/10 hover:text-[#8B3A3A]'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 border-t pt-3">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" />Booked</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" />Blocked</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <input type="hidden" required value={formData.eventDate} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Package</label>
                  <input
                    type="text"
                    value={formData.servicePackage}
                    onChange={(e) => setFormData({ ...formData, servicePackage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (RWF)</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (RWF)</label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#8B3A3A] text-white py-3 rounded-lg hover:bg-[#6d2e2e] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Saving...' : editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Quote Modal */}
      {acceptingQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setAcceptingQuote(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C2C2C]">Accept Quote</h3>
                <p className="text-sm text-gray-500">{acceptingQuote.clientName} &mdash; {new Date(acceptingQuote.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <form onSubmit={handleAcceptQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Service Package</label>
                <input
                  type="text"
                  value={acceptForm.servicePackage}
                  onChange={e => setAcceptForm({ ...acceptForm, servicePackage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  placeholder="e.g. Full Day Venue Rental"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Amount (RWF) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={acceptForm.totalAmount}
                  onChange={e => setAcceptForm({ ...acceptForm, totalAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  placeholder="e.g. 2000000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deposit Amount (RWF) <span className="text-gray-300 normal-case font-normal">optional</span></label>
                <input
                  type="number"
                  min="0"
                  value={acceptForm.depositAmount}
                  onChange={e => setAcceptForm({ ...acceptForm, depositAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  placeholder="e.g. 500000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updatingQuoteId === acceptingQuote.id || !acceptForm.totalAmount}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingQuoteId === acceptingQuote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirm & Notify Client
                </button>
                <button type="button" onClick={() => setAcceptingQuote(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decline Quote Modal */}
      {decliningQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDecliningQuote(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C2C2C]">Decline Quote</h3>
                <p className="text-sm text-gray-500">{decliningQuote.clientName} &mdash; {new Date(decliningQuote.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <form onSubmit={handleDeclineQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Reason for declining *</label>
                <textarea
                  required
                  rows={4}
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent resize-none"
                  placeholder="e.g. The date is already booked, we are unavailable for that period..."
                />
              </div>
              <p className="text-xs text-gray-400">This reason will be included in the email sent to the client.</p>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updatingQuoteId === decliningQuote.id || !declineReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingQuoteId === decliningQuote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Decline & Notify Client
                </button>
                <button type="button" onClick={() => setDecliningQuote(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VendorPageLayout>
  );
}
