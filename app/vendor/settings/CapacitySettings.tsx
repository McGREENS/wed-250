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
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-burgundy" />
          Daily Booking Limit
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Control how many bookings you accept per day
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Max bookings/day</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newVal = Math.max(1, maxBookingsPerDay - 1);
                  setMaxBookingsPerDay(newVal);
                  setIsDirty(true);
                }}
                disabled={maxBookingsPerDay <= 1 || saving}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-bold transition-colors"
              >
                −
              </button>
              
              <span className="w-12 text-center text-2xl font-bold text-burgundy">
                {maxBookingsPerDay}
              </span>
              
              <button
                onClick={() => {
                  const newVal = Math.min(10, maxBookingsPerDay + 1);
                  setMaxBookingsPerDay(newVal);
                  setIsDirty(true);
                }}
                disabled={maxBookingsPerDay >= 10 || saving}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {isDirty && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-burgundy hover:bg-burgundy/90 text-white"
              size="sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {maxBookingsPerDay === 1 
              ? "Exclusive service - one booking per day" 
              : `You can accept up to ${maxBookingsPerDay} bookings per day`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
