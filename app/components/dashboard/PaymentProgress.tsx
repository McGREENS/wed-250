"use client";

interface PaymentProgressProps {
  totalAmount: number;
  totalPaid: number;
  paymentStatus: string;
}

const STATUS_CONFIG = {
  PAID:         { label: "Fully Paid",    bg: "bg-green-100",  text: "text-green-700",  ring: "#16a34a" },
  DEPOSIT_PAID: { label: "Partial",       bg: "bg-amber-100",  text: "text-amber-700",  ring: "#d97706" },
  UNPAID:       { label: "Unpaid",        bg: "bg-red-100",    text: "text-red-600",    ring: "#dc2626" },
} as const;

export default function PaymentProgress({
  totalAmount,
  totalPaid,
  paymentStatus,
}: PaymentProgressProps) {
  const safeTotal = totalAmount > 0 ? totalAmount : 0;
  const safePaid  = Math.min(totalPaid, safeTotal);
  const pct       = safeTotal > 0 ? Math.round((safePaid / safeTotal) * 100) : 0;
  const remaining = Math.max(safeTotal - safePaid, 0);

  const status = STATUS_CONFIG[paymentStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.UNPAID;

  // SVG circle math
  const R          = 28;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const dashOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  if (safeTotal === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Payment Progress
        </p>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Body: circle + breakdown */}
      <div className="flex items-center gap-5">
        {/* Circular progress */}
        <div className="relative flex-shrink-0 w-16 h-16">
          <svg width="64" height="64" className="-rotate-90">
            {/* Track */}
            <circle
              cx="32" cy="32" r={R}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="32" cy="32" r={R}
              fill="none"
              stroke={status.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-charcoal">{pct}%</span>
          </div>
        </div>

        {/* Amount breakdown */}
        <div className="flex-1 space-y-2">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: status.ring }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xs font-bold text-charcoal">
                {safeTotal.toLocaleString()}
                <span className="font-normal text-gray-400"> RWF</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-xs font-bold" style={{ color: status.ring }}>
                {safePaid.toLocaleString()}
                <span className="font-normal text-gray-400"> RWF</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Remaining</p>
              <p className="text-xs font-bold text-gray-600">
                {remaining.toLocaleString()}
                <span className="font-normal text-gray-400"> RWF</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
