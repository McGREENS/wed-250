"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { X, Plus } from 'lucide-react';

interface AddManualExpenseProps {
  onExpenseAdded: () => void;
}

const CATEGORIES = [
  'Venue', 'Photography', 'Catering', 'Decoration',
  'Music', 'Planning', 'Transportation', 'Flowers', 'Attire', 'Other',
];

const EMPTY = {
  category: 'Venue',
  vendorName: '',
  amount: '',
  note: '',
  paidAt: new Date().toISOString().split('T')[0],
};

export default function AddManualExpense({ onExpenseAdded }: AddManualExpenseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/manual-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm(EMPTY);
        setIsOpen(false);
        onExpenseAdded();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="bg-burgundy hover:bg-burgundy/90 text-white"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add Expense
      </Button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-charcoal">New Manual Expense</p>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Row 1: category + vendor */}
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/40"
              required
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Vendor Name</label>
            <Input
              value={form.vendorName}
              onChange={e => set('vendorName', e.target.value)}
              placeholder="e.g., ABC Photography"
              required
              className="text-sm border-gray-200 focus:ring-burgundy/40"
            />
          </div>
        </div>

        {/* Row 2: amount + date */}
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount (RWF)</label>
            <Input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0"
              min="0"
              required
              className="text-sm border-gray-200 focus:ring-burgundy/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment Date</label>
            <Input
              type="date"
              value={form.paidAt}
              onChange={e => set('paidAt', e.target.value)}
              required
              className="text-sm border-gray-200 focus:ring-burgundy/40"
            />
          </div>
        </div>

        {/* Row 3: note */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Note <span className="text-gray-400 font-normal">(optional)</span></label>
          <Input
            value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="Any details about this payment..."
            className="text-sm border-gray-200 focus:ring-burgundy/40"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-burgundy hover:bg-burgundy/90 text-white text-sm px-5"
          >
            {loading ? 'Saving...' : 'Save Expense'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-sm border-gray-200 text-gray-600"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
