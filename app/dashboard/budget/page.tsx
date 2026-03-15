"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, Settings, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BudgetCategory {
  name: string;
  bookings: any[];
  totalSpent: number;
  paidAmount: number;
  percentOfBudget: number;
}

interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
  categories: BudgetCategory[];
  recentBookings: any[];
}

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await fetch('/api/budget');
        if (response.ok) {
          const data = await response.json();
          setBudgetData(data);
        }
      } catch (error) {
        console.error('Failed to fetch budget data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </UserPageLayout>
    );
  }

  if (!budgetData) {
    return (
      <UserPageLayout>
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-600">Failed to load budget data. Please try again.</p>
        </div>
      </UserPageLayout>
    );
  }

  const { totalBudget, totalSpent, remaining, percentUsed, categories } = budgetData;

  return (
    <UserPageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Budget</h1>
              <p className="text-gray-600">Track your wedding expenses and stay on budget</p>
            </div>
            <Link href="/dashboard/wedding-settings">
              <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Update Budget
              </Button>
            </Link>
          </div>
        </div>

        {totalBudget === 0 && (
          <Card className="border-yellow-200 bg-yellow-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">No Budget Set</h3>
                  <p className="text-sm text-yellow-700">
                    Set your wedding budget in 
                    <Link href="/dashboard/wedding-settings" className="underline ml-1">
                      Wedding Settings
                    </Link>
                    {' '}to track your spending progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Budget</p>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-charcoal">
                {totalBudget > 0 ? `RWF ${(totalBudget / 1000000).toFixed(1)}M` : 'Not Set'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Spent</p>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                RWF {(totalSpent / 1000000).toFixed(1)}M
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Remaining</p>
                <TrendingDown className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {totalBudget > 0 ? `RWF ${(remaining / 1000000).toFixed(1)}M` : 'N/A'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Budget Used</p>
              </div>
              <p className="text-2xl font-bold text-burgundy">
                {totalBudget > 0 ? `${percentUsed}%` : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {totalBudget > 0 && (
          <Card className="border-gray-100 shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-charcoal">Budget Overview</h3>
                <p className="text-sm text-gray-600">
                  RWF {(totalSpent / 1000000).toFixed(1)}M of RWF {(totalBudget / 1000000).toFixed(1)}M spent
                </p>
              </div>
              <Progress value={percentUsed} className="h-3" />
              {percentUsed > 90 && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  You're approaching your budget limit!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-charcoal">Spending by Category</h3>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="text-burgundy">
                  View All Bookings
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {categories.filter(cat => cat.totalSpent > 0).length > 0 ? (
                categories
                  .filter(category => category.totalSpent > 0)
                  .map((category, index) => {
                    const categoryPercent = totalBudget > 0 ? Math.round((category.totalSpent / totalBudget) * 100) : 0;
                    const isPaid = category.paidAmount >= category.totalSpent;

                    return (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-charcoal">{category.name}</h4>
                              {isPaid && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                  Paid
                                </span>
                              )}
                              {category.bookings.length > 0 && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {category.bookings.length} booking{category.bookings.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Total: <span className="font-medium text-charcoal">RWF {category.totalSpent.toLocaleString()}</span>
                              </span>
                              {category.paidAmount > 0 && (
                                <span className="text-gray-600">
                                  Paid: <span className="font-medium text-green-600">RWF {category.paidAmount.toLocaleString()}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-burgundy">
                              {totalBudget > 0 ? `${categoryPercent}%` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {totalBudget > 0 && <Progress value={categoryPercent} className="h-2" />}
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No bookings yet</p>
                  <p className="text-sm">Start booking vendors to see your spending breakdown</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Link href="/venues">
                      <Button variant="outline" size="sm">
                        Browse Venues
                      </Button>
                    </Link>
                    <Link href="/vendors">
                      <Button variant="outline" size="sm">
                        Browse Vendors
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPageLayout>
  );
}
