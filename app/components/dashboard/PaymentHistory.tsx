"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Loader2, Receipt, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  note: string | null;
  paidAt: string | number;
  createdAt: string | number;
}

interface PaymentHistoryProps {
  bookingId: string;
  refreshTrigger: number;
  onPaymentDeleted: (newTotalPaid: number, newStatus: string) => void;
}

export default function PaymentHistory({
  bookingId,
  refreshTrigger,
  onPaymentDeleted,
}: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/payments?bookingId=${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch {
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments, refreshTrigger]);

  const handleDelete = async (paymentId: string) => {
    setDeletingId(paymentId);
    try {
      const res = await fetch(
        `/api/bookings/payments?id=${paymentId}&bookingId=${bookingId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete payment.");
        return;
      }
      toast.success("Payment entry removed.");
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      setConfirmId(null);
      onPaymentDeleted(data.totalPaid, data.paymentStatus);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (val: string | number) => {
    const d = typeof val === "number" ? new Date(val * 1000) : new Date(val);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading payment history...</span>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2 text-gray-400">
        <Receipt className="w-8 h-8 text-gray-300" />
        <p className="text-sm">No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((payment, index) => (
        <div
          key={payment.id}
          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors group"
        >
          {/* Left — index + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-burgundy">{index + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-charcoal">
                {payment.amount.toLocaleString()}{" "}
                <span className="font-normal text-gray-500">RWF</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">{formatDate(payment.paidAt)}</span>
                {payment.note && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 truncate max-w-[160px]">
                      {payment.note}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right — delete */}
          <div className="flex-shrink-0 ml-3">
            {confirmId === payment.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Sure?
                </span>
                <button
                  onClick={() => handleDelete(payment.id)}
                  disabled={deletingId === payment.id}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                >
                  {deletingId === payment.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Yes"
                  )}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(payment.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                title="Remove payment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Total row */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 mt-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Total Paid
        </span>
        <span className="text-sm font-bold text-burgundy">
          {payments.reduce((s, p) => s + p.amount, 0).toLocaleString()} RWF
        </span>
      </div>
    </div>
  );
}
