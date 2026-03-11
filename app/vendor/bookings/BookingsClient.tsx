'use client';

import { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Phone, Mail, DollarSign } from 'lucide-react';
import VendorPageLayout from '@/app/components/vendor/VendorPageLayout';

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
}

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking?')) return;

    try {
      const res = await fetch(`/api/vendor/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/vendor/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
            <p className="text-gray-600 mt-1">Manage your client bookings</p>
          </div>
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
        </div>

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
                    <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {booking.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => handleEdit(booking)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(booking.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
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
      </div>

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
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent"
                  />
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
                  className="flex-1 bg-[#8B3A3A] text-white py-3 rounded-lg hover:bg-[#6d2e2e] disabled:opacity-50"
                >
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
    </VendorPageLayout>
  );
}
