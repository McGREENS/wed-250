"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Button } from "@/app/components/ui/button";
import { Settings, AlertCircle, TrendingUp, Wallet, PiggyBank, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AddManualExpense from '@/app/components/dashboard/AddManualExpense';
import ManualExpensesList from '@/app/components/dashboard/ManualExpensesList';

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
  totalPlanned: number;
  remaining: number;
  percentUsed: number;
  categories: BudgetCategory[];
  phases: { name: string; allocated: number; spent: number; taskCount: number }[];
  recentBookings: any[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Venue:          'bg-burgundy',
  Photography:    'bg-amber-500',
  Catering:       'bg-emerald-600',
  Decoration:     'bg-purple-500',
  Music:          'bg-blue-500',
  Planning:       'bg-rose-500',
  Transportation: 'bg-orange-500',
  Flowers:        'bg-pink-500',
  Attire:         'bg-indigo-500',
  Other:          'bg-gray-400',
};

const CATEGORY_LIGHT: Record<string, string> = {
  Venue:          'bg-burgundy/10 text-burgundy',
  Photography:    'bg-amber-50 text-amber-700',
  Catering:       'bg-emerald-50 text-emerald-700',
  Decoration:     'bg-purple-50 text-purple-700',
  Music:          'bg-blue-50 text-blue-700',
  Planning:       'bg-rose-50 text-rose-700',
  Transportation: 'bg-orange-50 text-orange-700',
  Flowers:        'bg-pink-50 text-pink-700',
  Attire:         'bg-indigo-50 text-indigo-700',
  Other:          'bg-gray-100 text-gray-600',
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch('/api/budget')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setBudgetData(data); })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-sand rounded w-1/3" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-sand/60 rounded-xl" />)}
          </div>
          <div className="h-64 bg-sand/40 rounded-xl" />
        </div>
      </UserPageLayout>
    );
  }

  if (!budgetData) {
    return (
      <UserPageLayout>
        <div className="max-w-6xl mx-auto text-center py-12 text-gray-500">
          Failed to load budget data.
        </div>
      </UserPageLayout>
    );
  }

  const { totalBudget, totalSpent, totalPlanned, remaining, percentUsed, categories, phases } = budgetData;
  const activeCategories = categories.filter(c => c.totalSpent > 0);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - Math.min(percentUsed, 100) / 100);
  const isOverBudget = totalBudget > 0 && totalSpent > totalBudget;

  return (
    <UserPageLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-charcoal mb-1">Wedding Budget</h1>
            <p className="text-sm text-gray-500">Track every franc — bookings and manual expenses combined</p>
          </div>
          <Link href="/dashboard/wedding-settings">
            <Button variant="outline" size="sm" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white flex-shrink-0">
              <Settings className="w-4 h-4 mr-1.5" />
              Edit Budget
            </Button>
          </Link>
        </div>

        {/* No budget warning */}
        {totalBudget === 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              No budget set yet.{' '}
              <Link href="/dashboard/wedding-settings" className="font-semibold underline">
                Set your total budget
              </Link>{' '}
              to unlock spending progress.
            </p>
          </div>
        )}

        {/* ── Top section: ring + 3 stat cards ── */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">

          {/* Ring card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
            {totalBudget > 0 ? (
              <>
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f3ede8" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke={isOverBudget ? '#dc2626' : '#7c2d3e'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-burgundy'}`}>
                      {Math.min(percentUsed, 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">used</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-charcoal">
                  RWF {fmt(totalSpent)} <span className="text-gray-400 font-normal">of</span> RWF {fmt(totalBudget)}
                </p>
                {isOverBudget && (
                  <p className="text-xs text-red-600 mt-1 font-medium">Over budget by RWF {fmt(totalSpent - totalBudget)}</p>
                )}
                {!isOverBudget && percentUsed >= 80 && (
                  <p className="text-xs text-amber-600 mt-1 font-medium">Approaching limit</p>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No budget set</p>
              </div>
            )}
          </div>

          {/* 3 stat cards stacked 2+1 on the right */}
          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Budget</span>
                <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-burgundy" />
                </div>
              </div>
              <p className="text-2xl font-bold text-charcoal">
                {totalBudget > 0 ? `RWF ${fmt(totalBudget)}` : '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Wedding total</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Spent</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-burgundy">RWF {fmt(totalSpent)}</p>
              {totalPlanned > 0 && (
                <p className="text-xs text-amber-600 mt-1 font-medium">+ RWF {fmt(totalPlanned)} planned</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">Paid so far</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Remaining</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                {totalBudget > 0 ? `RWF ${fmt(remaining)}` : '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">{isOverBudget ? 'Over budget' : 'After spent & planned'}</p>
            </div>
          </div>
        </div>

        {/* ── Category breakdown ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-charcoal">Spending by Category</h2>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-burgundy text-xs">All Bookings →</Button>
            </Link>
          </div>

          {activeCategories.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-25" />
              <p className="text-sm font-medium text-gray-500 mb-1">No payments recorded yet</p>
              <p className="text-xs mb-4">Book vendors or add manual expenses to see your breakdown</p>
              <div className="flex gap-2 justify-center">
                <Link href="/venues"><Button variant="outline" size="sm">Browse Venues</Button></Link>
                <Link href="/vendors"><Button variant="outline" size="sm">Browse Vendors</Button></Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCategories.map((cat, i) => {
                const barWidth = totalSpent > 0 ? (cat.totalSpent / totalSpent) * 100 : 0;
                const budgetPct = totalBudget > 0 ? (cat.totalSpent / totalBudget) * 100 : 0;
                const color = CATEGORY_COLORS[cat.name] || 'bg-gray-400';
                const light = CATEGORY_LIGHT[cat.name] || 'bg-gray-100 text-gray-600';

                return (
                  <div key={i} className="group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${light}`}>
                        {cat.name}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${color}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-right">
                        <span className="text-sm font-semibold text-charcoal w-24 text-right">
                          RWF {fmt(cat.totalSpent)}
                        </span>
                        {totalBudget > 0 && (
                          <span className="text-xs text-gray-400 w-10 text-right">
                            {budgetPct.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    {cat.bookings.length > 0 && (
                      <p className="text-[11px] text-gray-400 pl-2 mb-1">
                        {cat.bookings.length} booking{cat.bookings.length > 1 ? 's' : ''} via platform
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Total row */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal">Total paid</span>
                <span className="text-sm font-bold text-burgundy">RWF {fmt(totalSpent)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Wedding phase task budgets ── */}
        {phases && phases.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-charcoal">Budget by Wedding Phase</h2>
              <Link href="/dashboard/checklist">
                <Button variant="ghost" size="sm" className="text-burgundy text-xs">Checklist →</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {phases.map((phase, i) => {
                const total = phase.spent + phase.allocated;
                const spentPct = total > 0 ? (phase.spent / total) * 100 : 0;
                const allocPct = total > 0 ? (phase.allocated / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 bg-burgundy/10 text-burgundy">
                        {phase.name}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-burgundy transition-all duration-500" style={{ width: `${spentPct}%` }} />
                        <div className="h-full bg-amber-300 transition-all duration-500" style={{ width: `${allocPct}%` }} />
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {phase.spent > 0 && <span className="text-xs font-semibold text-charcoal">RWF {fmt(phase.spent)} spent</span>}
                        {phase.allocated > 0 && <span className="text-xs text-amber-600 ml-2">+ {fmt(phase.allocated)} planned</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-burgundy inline-block" /> Spent</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-amber-300 inline-block" /> Planned</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Manual expenses ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-1">
            <div>
              <h2 className="text-base font-semibold text-charcoal">Manual Expenses</h2>
              <p className="text-xs text-gray-400 mt-0.5">Vendors booked outside the platform</p>
            </div>
            <div className="sm:flex-shrink-0">
              <AddManualExpense onExpenseAdded={() => setRefreshTrigger(t => t + 1)} />
            </div>
          </div>
          <ManualExpensesList refreshTrigger={refreshTrigger} />
        </div>

      </div>
    </UserPageLayout>
  );
}
