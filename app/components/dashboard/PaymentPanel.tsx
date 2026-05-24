"use client";

import { useState } from "react";
import { PlusCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentPanelProps {
  bookingId: string;
  totalAmount: number;
  totalPaid: number;
  onPaymentAdded: (newTotalPaid: number, newStatus: string) => void;
}

interface FormState {
  amount: string;
  note: string;
  paidAt: string;
}

const today = () => new Date().toISOString().split("T")[0];

export default function PaymentPanel({
  bookingId,
  totalAmount,
  totalPaid,
  onPaymentAdded,
}: PaymentPanelProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({ amount: "", note: "", paidAt: today() });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const remaining = Math.max(totalAmount - totalPaid, 0);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    const amt = parseFloat(form.amount);

    if (!form.amount || isNaN(amt) || amt <= 0) {
      next.amount = "Enter a valid amount greater than 0.";
    } else if (amt > remaining + 0.01) {
      next.amount = `Amount exceeds remaining balance of ${remaining.toLocaleString()} RWF.`;
    }
    if (!form.paidAt) {
      next.paidAt = "Payment date is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: parseFloat(form.amount),
          note: form.note.trim() || null,
          paidAt: form.paidAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to record payment.");
        return;
      }

      toast.success("Payment recorded successfully!");
      onPaymentAdded(data.totalPaid, data.paymentStatus);
      setForm({ amount: "", note: "", paidAt: today() });
      setErrors({});
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const isFullyPaid = remaining <= 0;

  return (
    <div className="mt-4">
      {/* Toggle button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={isFullyPaid}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center border
            ${isFullyPaid
              ? "border-green-200 bg-green-50 text-green-600 cursor-not-allowed"
              : "border-burgundy/30 bg-burgundy/5 text-burgundy hover:bg-burgundy hover:text-white"
            }`}
        >
          {isFullyPaid ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Fully Paid
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Record a Payment
            </>
          )}
        </button>
      ) : (
        <div className="border border-burgundy/20 rounded-xl bg-white shadow-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 bg-burgundy/5 border-b border-burgundy/10">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-burgundy" />
              <span className="text-sm font-semibold text-charcoal">Record a Payment</span>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); setErrors({}); }}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Remaining balance hint */}
          <div className="px-5 pt-4 pb-0">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Remaining balance:{" "}
                <span className="font-bold">{remaining.toLocaleString()} RWF</span>
                {" "}out of{" "}
                <span className="font-semibold">{totalAmount.toLocaleString()} RWF</span> total.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Amount Paid (RWF) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  RWF
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 200000"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                    ${errors.amount
                      ? "border-red-400 focus:ring-red-200 bg-red-50"
                      : "border-gray-300 focus:ring-burgundy/30 focus:border-burgundy"
                    }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.amount}
                </p>
              )}
              {/* Quick-fill buttons */}
              {remaining > 0 && (
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((pct) => {
                    const val = Math.round((remaining * pct) / 100);
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleChange("amount", String(val))}
                        className="flex-1 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:border-burgundy hover:text-burgundy transition-colors"
                      >
                        {pct}%
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.paidAt}
                max={today()}
                onChange={(e) => handleChange("paidAt", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                  ${errors.paidAt
                    ? "border-red-400 focus:ring-red-200 bg-red-50"
                    : "border-gray-300 focus:ring-burgundy/30 focus:border-burgundy"
                  }`}
              />
              {errors.paidAt && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.paidAt}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Bank transfer, Mobile money..."
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                maxLength={120}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setOpen(false); setErrors({}); }}
                disabled={submitting}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Save Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
