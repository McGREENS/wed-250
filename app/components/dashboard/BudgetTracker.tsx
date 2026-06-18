import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";

export default function BudgetTracker({ totalBudget, bookings = [] }: any) {
  const spentAmount = bookings.reduce((sum: any, booking: any) => {
    if (booking.payment_status === 'paid' || booking.payment_status === 'deposit_paid') {
      return sum + (booking.quote_amount || 0);
    }
    return sum;
  }, 0);

  const pendingAmount = bookings.reduce((sum: any, booking: any) => {
    if (booking.payment_status === 'unpaid') {
      return sum + (booking.quote_amount || 0);
    }
    return sum;
  }, 0);

  const remainingBudget = totalBudget - spentAmount - pendingAmount;
  const spentPercentage = (spentAmount / totalBudget) * 100;
  const pendingPercentage = (pendingAmount / totalBudget) * 100;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-burgundy" />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Total Budget */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-gray-600">Total Budget</span>
              <span className="text-2xl font-bold text-charcoal">
                ${totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-burgundy transition-all"
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full bg-burgundy/30 transition-all"
                style={{
                  left: `${Math.min(spentPercentage, 100)}%`,
                  width: `${Math.min(pendingPercentage, 100 - spentPercentage)}%`
                }}
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-burgundy rounded-full" />
                <span className="text-sm text-gray-700">Spent</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-charcoal">
                  ${spentAmount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {spentPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-burgundy/30 rounded-full" />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-charcoal">
                  ${pendingAmount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {pendingPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gold rounded-full" />
                <span className="text-sm font-medium text-gray-700">Remaining</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gold">
                  ${remainingBudget.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Status */}
          {remainingBudget < 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                ⚠️ You're over budget by ${Math.abs(remainingBudget).toLocaleString()}
              </p>
            </div>
          )}

          {remainingBudget >= 0 && remainingBudget < totalBudget * 0.1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                You're close to your budget limit. Plan accordingly!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}