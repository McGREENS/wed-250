"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ManualExpense {
  id: string;
  category: string;
  vendorName: string;
  amount: number;
  note: string | null;
  paidAt: string;
  createdAt: string;
}

interface ManualExpensesListProps {
  refreshTrigger: number;
}

const CATEGORY_DOT: Record<string, string> = {
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

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

export default function ManualExpensesList({ refreshTrigger }: ManualExpensesListProps) {
  const [expenses, setExpenses] = useState<ManualExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchExpenses(); }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/manual-expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/manual-expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) setExpenses(prev => prev.filter(e => e.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) return null;

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="mt-4">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_80px_40px] gap-x-3 px-3 mb-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Vendor</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide hidden sm:block text-right">Date</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Amount</span>
        <span />
      </div>

      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {expenses.map((expense) => {
          const dot = CATEGORY_DOT[expense.category] || 'bg-gray-400';
          return (
            <div
              key={expense.id}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_80px_40px] gap-x-3 items-center px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Vendor + category */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{expense.vendorName}</p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {expense.category}{expense.note ? ` · ${expense.note}` : ''}
                  </p>
                </div>
              </div>

              {/* Date — hidden on mobile */}
              <p className="text-xs text-gray-400 text-right hidden sm:block">
                {new Date(expense.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              {/* Amount */}
              <p className="text-sm font-semibold text-charcoal text-right tabular-nums">
                {fmt(expense.amount)}
              </p>

              {/* Delete */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Total row */}
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_120px_80px_40px] gap-x-3 items-center px-4 py-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500">
            {expenses.length} expense{expenses.length > 1 ? 's' : ''}
          </p>
          <span className="hidden sm:block" />
          <p className="text-sm font-bold text-burgundy text-right tabular-nums">
            {fmt(total)} <span className="text-xs font-normal text-gray-400">RWF</span>
          </p>
          <span />
        </div>
      </div>
    </div>
  );
}
