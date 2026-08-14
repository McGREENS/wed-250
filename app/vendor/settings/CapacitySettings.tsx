'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Loader2, Save, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CapacitySettings() {
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchCapacitySettings();
  }, []);

  const fetchCapacitySettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vendor/capacity-settings');
      const data = await res.json();
      
      if (res.ok && data.maxBookingsPerDay) {
        setMaxBookingsPerDay(data.maxBookingsPerDay);
      }
    } catch (error) {
      console.error('Error fetching capacity settings:', error);
      toast.error('Failed to load capacity settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (maxBookingsPerDay < 1) {
      toast.error('Minimum 1 booking per day is required');
      return;
    }

    if (maxBookingsPerDay > 10) {
      toast.error('Maximum 10 bookings per day allowed');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/vendor/capacity-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxBookingsPerDay }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Capacity settings updated successfully');
        setIsDirty(false);
      } else {
        toast.error(data.error || 'Failed to save capacity settings');
      }
    } catch (error) {
      console.error('Error saving capacity settings:', error);
      toast.error('Failed to save capacity settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-burgundy" />
          Daily Booking Capacity
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Set the maximum number of bookings you can accept per day. This prevents overbooking and ensures quality service.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <Check className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900 text-sm">How it works</p>
              <p className="text-sm text-blue-700 mt-1">
                Once you reach the daily limit, customers won't be able to book additional slots for that date. They'll see "Date at capacity" error.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Maximum Bookings Per Day
            </label>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-xs">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      const newVal = Math.max(1, maxBookingsPerDay - 1);
                      setMaxBookingsPerDay(newVal);
                      setIsDirty(true);
                    }}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold"
                    disabled={maxBookingsPerDay <= 1 || saving}
                  >
                    −
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxBookingsPerDay}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                      setMaxBookingsPerDay(val);
                      setIsDirty(true);
                    }}
                    className="flex-1 text-center text-2xl font-bold text-gray-900 border-0 focus:outline-none"
                  />
                  
                  <button
                    onClick={() => {
                      const newVal = Math.min(10, maxBookingsPerDay + 1);
                      setMaxBookingsPerDay(newVal);
                      setIsDirty(true);
                    }}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold"
                    disabled={maxBookingsPerDay >= 10 || saving}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-2">
                  {maxBookingsPerDay === 1 && (
                    <p className="text-sm text-gray-600">
                      ✓ Exclusive - One client per day
                    </p>
                  )}
                  {maxBookingsPerDay === 2 && (
                    <p className="text-sm text-gray-600">
                      ✓ You can accept 2 clients per day
                    </p>
                  )}
                  {maxBookingsPerDay > 2 && (
                    <p className="text-sm text-gray-600">
                      ✓ You can accept {maxBookingsPerDay} clients per day
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <div className="flex-shrink-0 pt-0.5">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-900 text-sm">Current Bookings</p>
                <p className="text-sm text-amber-700 mt-1">
                  Changing this setting will only affect new bookings. Existing bookings remain unchanged.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="bg-burgundy hover:bg-burgundy/90 text-white gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            {isDirty && (
              <Button
                variant="outline"
                onClick={fetchCapacitySettings}
                className="text-gray-600"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
