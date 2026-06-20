"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { X, Plus } from 'lucide-react';

interface AddManualExpenseProps {
  onExpenseAdded: () => void;
}

const CATEGORIES = [
  'Venue',
  'Photography',
  'Catering',
  'Decoration',
  'Music',
  'Planning',
  'Transportation',
  'Flowers',
  'Attire',
  'Other'
];

export default function AddManualExpense({ onExpenseAdded }: AddManualExpenseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Venue',
    vendorName: '',
    amount: '',
    note: '',
    paidAt: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/manual-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          category: 'Venue',
          vendorName: '',
          amount: '',
          note: '',
          paidAt: new Date().toISOString().split('T')[0],
        });
        setIsOpen(false);
        onExpenseAdded();
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-burgundy hover:bg-burgundy-light text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Manual Expense
      </Button>
    );
  }

  return (
    <div className="border border-burgundy/20 rounded-lg p-6 bg-gradient-to-br from-sand/40 via-cream to-sand/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-charcoal">Add Manual Expense</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-charcoal/60 hover:text-charcoal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-charcoal/70 mb-4">
        Track payments for vendors booked outside our platform
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Vendor Name
          </label>
          <Input
            type="text"
            value={formData.vendorName}
            onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
            placeholder="e.g., ABC Photography"
            required
            className="border-sand focus:ring-burgundy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Amount (RWF)
          </label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0"
            min="0"
            step="0.01"
            required
            className="border-sand focus:ring-burgundy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Payment Date
          </label>
          <Input
            type="date"
            value={formData.paidAt}
            onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
            required
            className="border-sand focus:ring-burgundy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Note (Optional)
          </label>
          <Textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Add any notes about this payment..."
            rows={3}
            className="border-sand focus:ring-burgundy resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-burgundy hover:bg-burgundy-light text-white"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-burgundy text-burgundy hover:bg-burgundy/10"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
