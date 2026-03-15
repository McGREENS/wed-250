"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar, Save, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WeddingDetails {
  id?: string;
  coupleNames: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  notes: string;
}

export default function WeddingSettingsPage() {
  const [wedding, setWedding] = useState<WeddingDetails>({
    coupleNames: '',
    weddingDate: '',
    budget: 0,
    guestCount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await fetch('/api/wedding-settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setWedding({
              id: data.id,
              coupleNames: data.coupleNames || '',
              weddingDate: data.weddingDate ? new Date(data.weddingDate).toISOString().split('T')[0] : '',
              budget: data.budget || 0,
              guestCount: data.guestCount || 0,
              notes: data.notes || ''
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch wedding details:', error);
        toast.error('Failed to load wedding details');
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingDetails();
  }, []);

  const handleSave = async () => {
    if (!wedding.coupleNames || !wedding.weddingDate) {
      toast.error('Please fill in couple names and wedding date');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/wedding-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wedding),
      });

      if (response.ok) {
        const savedWedding = await response.json();
        setWedding(prev => ({ ...prev, id: savedWedding.id }));
        toast.success('Wedding details saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save wedding details');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save wedding details');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof WeddingDetails, value: string | number) => {
    setWedding(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Settings</h1>
          <p className="text-gray-600">Set up your wedding details for personalized planning</p>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-burgundy" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">Wedding Details</h2>
                  <p className="text-sm text-gray-600">Configure your wedding information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coupleNames" className="text-sm font-medium text-charcoal">
                    Couple Names *
                  </Label>
                  <Input
                    id="coupleNames"
                    placeholder="e.g., John & Jane Smith"
                    value={wedding.coupleNames}
                    onChange={(e) => handleInputChange('coupleNames', e.target.value)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">This will appear on your dashboard and documents</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingDate" className="text-sm font-medium text-charcoal">
                    Wedding Date *
                  </Label>
                  <div className="relative">
                    <Input
                      id="weddingDate"
                      type="date"
                      value={wedding.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                      className="border-gray-200 focus:border-burgundy pl-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-gray-500">Used for countdown and timeline planning</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-charcoal">
                    Total Budget (RWF)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={wedding.budget || ''}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">Optional: helps track spending progress</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-sm font-medium text-charcoal">
                    Expected Guest Count
                  </Label>
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="0"
                    value={wedding.guestCount || ''}
                    onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">Helps vendors provide accurate quotes</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-charcoal">
                  Wedding Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes about your wedding (theme, preferences, special requirements...)"
                  value={wedding.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-gray-200 focus:border-burgundy min-h-[100px]"
                />
                <p className="text-xs text-gray-500">Optional: additional details about your wedding vision</p>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button
                  onClick={handleSave}
                  disabled={saving || !wedding.coupleNames || !wedding.weddingDate}
                  className="bg-burgundy text-white hover:bg-burgundy/90 px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Wedding Details'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-sand/20 rounded-lg">
          <h3 className="font-medium text-charcoal mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Setting your wedding date enables the countdown timer and planning timeline</li>
            <li>• Your budget helps track spending and shows progress on the dashboard</li>
            <li>• Guest count helps vendors provide more accurate quotes and recommendations</li>
            <li>• You can update these details anytime as your plans evolve</li>
          </ul>
        </div>
      </div>
    </UserPageLayout>
  );
}