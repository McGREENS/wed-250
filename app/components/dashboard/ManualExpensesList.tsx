"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Trash2, Receipt } from 'lucide-react';

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

export default function ManualExpensesList({ refreshTrigger }: ManualExpensesListProps) {
  const [expenses, setExpenses] = useState<ManualExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/manual-expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/manual-expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-charcoal/60">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-burgundy" />
        <h3 className="font-semibold text-charcoal">Manual Expenses</h3>
        <span className="text-sm text-charcoal/60">({expenses.length})</span>
      </div>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="border-burgundy/10 bg-gradient-to-br from-sand/20 via-cream to-sand/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-charcoal">{expense.vendorName}</h4>
                    <span className="text-xs px-2 py-0.5 bg-burgundy/10 text-burgundy rounded">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/70 mb-2">
                    Paid on {new Date(expense.paidAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  {expense.note && (
                    <p className="text-sm text-charcoal/60 italic">{expense.note}</p>
                  )}
                </div>
                <div className="text-right flex items-start gap-2">
                  <div>
                    <p className="font-bold text-burgundy">
                      {expense.amount.toLocaleString()} RWF
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
