'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ClearDataPage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clear-vendors', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to clear data');
        return;
      }

      toast.success(`Successfully deleted ${data.deletedVendorAccounts} vendor accounts and all related data`);
      setShowConfirm(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-charcoal mb-8">Clear Database</h1>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-charcoal mb-2">Delete All Vendors & Venues</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-4">
              <li>• All vendor accounts and user profiles</li>
              <li>• All venues</li>
              <li>• All service packages</li>
              <li>• All bookings</li>
              <li>• All reviews</li>
              <li>• All favorites</li>
              <li>• All venue tour requests</li>
            </ul>
            <p className="text-sm font-semibold text-red-600 mb-4">
              ⚠️ This action cannot be undone!
            </p>

            {!showConfirm ? (
              <Button
                onClick={() => setShowConfirm(true)}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-red-700">
                  Are you absolutely sure? This will delete everything!
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClearData}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Yes, Delete Everything
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowConfirm(false)}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
