"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Send, Eye, Edit, Trash2, FileText, DollarSign, Clock, CheckCircle, XCircle, Loader2, Download, Palette, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  items: string;
  color?: string;
}

export default function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    discount: 0,
    notes: "",
    terms: "Payment is due within 30 days",
    color: "#8B4513",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0, taxable: true },
  ]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, taxable: true }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;

    items.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;
      if (item.taxable) {
        taxAmount += itemTotal * 0.18;
      }
    });

    const total = subtotal + taxAmount - formData.discount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          status: "DRAFT",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Invoice created successfully!");
        setShowModal(false);
        resetForm();
        await fetchInvoices();
      } else {
        toast.error(data.error || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setSending(false);
    }
  };

  const sendInvoice = async (invoiceId: string) => {
    setSendingId(invoiceId);
    try {
      const res = await fetch("/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      if (res.ok) {
        toast.success("Invoice sent successfully!");
        await fetchInvoices();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    } finally {
      setSendingId(null);
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    setDeletingId(invoiceId);
    try {
      const res = await fetch(`/api/invoices?id=${invoiceId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Invoice deleted successfully!");
        await fetchInvoices();
        setShowDeleteModal(false);
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingId(null);
    }
  };

  const markAsPaid = async (invoiceId: string) => {
    setMarkingPaidId(invoiceId);
    try {
      const res = await fetch("/api/invoices/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      if (res.ok) {
        toast.success("Invoice marked as paid!");
        await fetchInvoices();
        setShowMarkPaidModal(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to mark as paid");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to mark as paid");
    } finally {
      setMarkingPaidId(null);
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    const url = `/invoices/${invoiceId}`;
    window.open(url, "_blank");
  };

  const openEditModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    const parsedItems = JSON.parse(invoice.items);
    setItems(parsedItems);
    setFormData({
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientPhone: "",
      clientAddress: "",
      issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
      dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
      discount: invoice.discount,
      notes: "",
      terms: "Payment is due within 30 days",
      color: invoice.color || "#8B4513",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    setSending(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: editingInvoice.id,
          ...formData,
          items,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Invoice updated successfully!");
        setShowEditModal(false);
        setEditingInvoice(null);
        resetForm();
        await fetchInvoices();
      } else {
        toast.error(data.error || "Failed to update invoice");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      discount: 0,
      notes: "",
      terms: "Payment is due within 30 days",
      color: "#8B4513",
    });
    setItems([{ description: "", quantity: 1, unitPrice: 0, taxable: true }]);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: "bg-sand text-charcoal",
      SENT: "bg-burgundy text-cream",
      PAID: "bg-gold text-charcoal",
      OVERDUE: "bg-burgundy-light text-cream",
      CANCELLED: "bg-charcoal/70 text-cream",
    };
    return styles[status as keyof typeof styles] || styles.DRAFT;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="w-4 h-4" />;
      case "SENT":
        return <Send className="w-4 h-4" />;
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "OVERDUE":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const ColorPicker = ({ value, onChange }: { value: string; onChange: (c: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [hex, setHex] = useState(value);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => { setHex(value); }, [value]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);

    const swatches = [
      // Reds & Pinks
      '#dc2626','#ef4444','#f87171','#fca5a5',
      '#be185d','#db2777','#ec4899','#f9a8d4',
      // Oranges & Yellows
      '#c2410c','#ea580c','#f97316','#fdba74',
      '#a16207','#ca8a04','#eab308','#fde047',
      // Greens
      '#14532d','#15803d','#16a34a','#4ade80',
      '#065f46','#047857','#10b981','#6ee7b7',
      // Blues
      '#1e3a8a','#1e40af','#2563eb','#93c5fd',
      '#0c4a6e','#0369a1','#0ea5e9','#7dd3fc',
      // Purples & Violets
      '#4c1d95','#6d28d9','#7c3aed','#c4b5fd',
      '#701a75','#a21caf','#c026d3','#e879f9',
      // Neutrals & Browns
      '#8B4513','#92400e','#78350f','#d97706',
      '#1f2937','#374151','#6b7280','#9ca3af',
    ];

    const applyHex = (raw: string) => {
      const val = raw.startsWith('#') ? raw : `#${raw}`;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) { onChange(val); setHex(val); }
    };

    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <span className="w-6 h-6 rounded border border-gray-200 flex-shrink-0" style={{ backgroundColor: value }} />
          <span className="text-sm font-mono text-gray-700 uppercase">{value}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-xl w-72">
            {/* Swatch grid */}
            <div className="grid grid-cols-8 gap-1.5 mb-4">
              {swatches.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onChange(c); setHex(c); }}
                  className="w-7 h-7 rounded-md transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: c,
                    boxShadow: value === c ? '0 0 0 2px white, 0 0 0 4px #1f2937' : 'none',
                  }}
                  title={c}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-3" />

            {/* Custom color row */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 flex-shrink-0">Custom:</label>
              <div className="relative flex-shrink-0">
                <input
                  type="color"
                  value={value}
                  onChange={e => { onChange(e.target.value); setHex(e.target.value); }}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5"
                />
              </div>
              <span className="text-xs text-gray-400">#</span>
              <input
                type="text"
                maxLength={6}
                value={hex.replace('#', '')}
                onChange={e => setHex(`#${e.target.value}`)}
                onBlur={e => applyHex(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyHex(hex)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono uppercase"
                placeholder="e.g. ff5733"
              />
            </div>

            {/* Preview */}
            <div className="mt-3 rounded-lg h-8 border border-gray-200 transition-colors" style={{ backgroundColor: value }} />
          </div>
        )}
      </div>
    );
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "DRAFT").length,
    sent: invoices.filter((i) => i.status === "SENT").length,
    paid: invoices.filter((i) => i.status === "PAID").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and send invoices to clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cream p-6 rounded-lg shadow-sm border border-burgundy/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-burgundy/15 rounded-lg">
              <FileText className="w-6 h-6 text-burgundy" />
            </div>
            <div>
              <p className="text-sm text-charcoal/60">Total</p>
              <p className="text-2xl font-bold text-burgundy">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream p-6 rounded-lg shadow-sm border border-sand">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sand rounded-lg">
              <FileText className="w-6 h-6 text-charcoal/70" />
            </div>
            <div>
              <p className="text-sm text-charcoal/60">Draft</p>
              <p className="text-2xl font-bold text-charcoal">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-burgundy p-6 rounded-lg shadow-sm border border-burgundy">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Send className="w-6 h-6 text-cream" />
            </div>
            <div>
              <p className="text-sm text-cream/80">Sent</p>
              <p className="text-2xl font-bold text-cream">{stats.sent}</p>
            </div>
          </div>
        </div>

        <div className="bg-gold p-6 rounded-lg shadow-sm border border-gold">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-charcoal" />
            </div>
            <div>
              <p className="text-sm text-charcoal/70">Paid</p>
              <p className="text-2xl font-bold text-charcoal">{stats.paid}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cream rounded-lg shadow-sm border border-burgundy/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/50 border-b border-burgundy/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No invoices yet</p>
                    <p className="text-sm mt-1">Create your first invoice to get started</p>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-burgundy">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-charcoal">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-charcoal">
                        {invoice.total.toLocaleString()} RWF
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {invoice.status === "DRAFT" && (
                          <button
                            onClick={() => sendInvoice(invoice.id)}
                            disabled={sendingId === invoice.id}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Send invoice"
                          >
                            {sendingId === invoice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceId(invoice.id);
                              setShowMarkPaidModal(true);
                            }}
                            disabled={markingPaidId === invoice.id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as paid"
                          >
                            {markingPaidId === invoice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <DollarSign className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => downloadInvoice(invoice.id)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/invoices/${invoice.id}`, "_blank")}
                          className="text-gray-600 hover:text-gray-800"
                          title="View invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(invoice)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Edit invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInvoiceId(invoice.id);
                            setShowDeleteModal(true);
                          }}
                          disabled={deletingId === invoice.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete invoice"
                        >
                          {deletingId === invoice.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Create New Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Address
                  </label>
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Invoice Items *</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-burgundy hover:text-burgundy/80"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          required
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Price"
                          required
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={item.taxable}
                            onChange={(e) => updateItem(index, "taxable", e.target.checked)}
                            className="rounded"
                          />
                          Tax Included
                        </label>
                      </div>
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span className="font-semibold">{taxAmount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-burgundy">{total.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="Additional notes for the client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Invoice Color
                </label>
                <ColorPicker
                  value={formData.color}
                  onChange={(c) => setFormData({ ...formData, color: c })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || items.length === 0}
                  className="flex-1 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Create Invoice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Edit Invoice - {editingInvoice.invoiceNumber}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Address
                  </label>
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Invoice Items *</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-burgundy hover:text-burgundy/80"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          required
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Price"
                          required
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={item.taxable}
                            onChange={(e) => updateItem(index, "taxable", e.target.checked)}
                            className="rounded"
                          />
                          Tax
                        </label>
                      </div>
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span className="font-semibold">{taxAmount.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-burgundy">{total.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  placeholder="Additional notes for the client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Invoice Color
                </label>
                <ColorPicker
                  value={formData.color}
                  onChange={(c) => setFormData({ ...formData, color: c })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingInvoice(null);
                    resetForm();
                  }}
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || items.length === 0}
                  className="flex-1 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Invoice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-charcoal">Delete Invoice</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedInvoiceId(null);
                }}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedInvoiceId && deleteInvoice(selectedInvoiceId)}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMarkPaidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-charcoal">Mark as Paid</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Confirm that this invoice has been paid by the client?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMarkPaidModal(false);
                  setSelectedInvoiceId(null);
                }}
                disabled={markingPaidId !== null}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedInvoiceId && markAsPaid(selectedInvoiceId)}
                disabled={markingPaidId !== null}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {markingPaidId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark as Paid
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
