"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  DollarSign, TrendingUp, Users, Plus, Pencil, Trash2, Loader2,
  Calculator, FileText, Calendar, ChevronDown, Receipt, Coins, Briefcase,
} from "lucide-react";
import { toast } from "sonner";

interface FinanceRecord {
  id: string;
  vendorId: string;
  month: number;
  year: number;
  grossIncome: number;
  taxRate: number;
  taxAmount: number;
  labourCosts: number;
  netProfit: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-RW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " RWF";
}

export default function FinancesClient() {
  const [activeTab, setActiveTab] = useState<"tax" | "profit" | "labour">("tax");
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    grossIncome: "",
    taxRate: "18",
    labourCosts: "",
    notes: "",
  });

  // Fetch finances on mount
  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/finances");
      if (res.ok) {
        const data = await res.json();
        setFinances(data.finances || []);
      } else {
        toast.error("Failed to load financial records");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      grossIncome: "",
      taxRate: "18",
      labourCosts: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        month: parseInt(formData.month.toString()),
        year: parseInt(formData.year.toString()),
        grossIncome: parseFloat(formData.grossIncome) || 0,
        taxRate: parseFloat(formData.taxRate) || 18,
        labourCosts: parseFloat(formData.labourCosts) || 0,
        notes: formData.notes,
      };

      let res;
      if (editingId) {
        // Update existing
        res = await fetch("/api/vendor/finances", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingId }),
        });
      } else {
        // Create new
        res = await fetch("/api/vendor/finances", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(editingId ? "Record updated successfully" : "Record created successfully");
        resetForm();
        fetchFinances();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save record");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record: FinanceRecord) => {
    setFormData({
      month: record.month,
      year: record.year,
      grossIncome: record.grossIncome.toString(),
      taxRate: record.taxRate.toString(),
      labourCosts: record.labourCosts.toString(),
      notes: record.notes || "",
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this financial record?")) return;

    try {
      const res = await fetch(`/api/vendor/finances?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Record deleted successfully");
        fetchFinances();
      } else {
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete record");
    }
  };

  // Calculate totals
  const currentYear = new Date().getFullYear();
  const yearRecords = finances.filter(f => f.year === currentYear);
  const totals = {
    grossIncome: yearRecords.reduce((sum, f) => sum + f.grossIncome, 0),
    taxAmount: yearRecords.reduce((sum, f) => sum + f.taxAmount, 0),
    labourCosts: yearRecords.reduce((sum, f) => sum + f.labourCosts, 0),
    netProfit: yearRecords.reduce((sum, f) => sum + f.netProfit, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Financial Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track your income, taxes, labour costs, and profit</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-burgundy hover:bg-burgundy/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Add Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-burgundy shadow-sm bg-burgundy">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-white/90">Total Income ({currentYear})</p>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totals.grossIncome)}</p>
          </CardContent>
        </Card>

        <Card className="border-gold shadow-sm bg-gold">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-charcoal/90">Total Tax ({currentYear})</p>
              <div className="w-8 h-8 bg-white/40 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-charcoal" />
              </div>
            </div>
            <p className="text-2xl font-bold text-charcoal">{formatCurrency(totals.taxAmount)}</p>
          </CardContent>
        </Card>

        <Card className="border-charcoal shadow-sm bg-charcoal">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-white/90">Labour Costs ({currentYear})</p>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totals.labourCosts)}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500 shadow-sm bg-green-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-white/90">Net Profit ({currentYear})</p>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totals.netProfit)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-burgundy/30 shadow-sm bg-cream">
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-burgundy/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-burgundy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {editingId ? "Edit Financial Record" : "Add Financial Record"}
                  </p>
                  <p className="text-xs text-gray-400">Enter your gross income and expenses</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Month */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Calendar className="w-3 h-3 inline mr-1" /> Month
                  </label>
                  <select
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                    required
                  >
                    {MONTHS.map((month, idx) => (
                      <option key={idx} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Calendar className="w-3 h-3 inline mr-1" /> Year
                  </label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    min="2000"
                    max="2100"
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Gross Income */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Coins className="w-3 h-3 inline mr-1" /> Gross Income (RWF)
                  </label>
                  <Input
                    type="number"
                    value={formData.grossIncome}
                    onChange={e => setFormData({ ...formData, grossIncome: e.target.value })}
                    placeholder="0"
                    step="0.01"
                    required
                    className="h-10"
                  />
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Calculator className="w-3 h-3 inline mr-1" /> Tax Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.taxRate}
                    onChange={e => setFormData({ ...formData, taxRate: e.target.value })}
                    placeholder="18"
                    step="0.01"
                    required
                    className="h-10"
                  />
                  <p className="text-xs text-gray-400 mt-1">Rwanda VAT: 18%</p>
                </div>

                {/* Labour Costs */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Users className="w-3 h-3 inline mr-1" /> Labour Costs (RWF)
                  </label>
                  <Input
                    type="number"
                    value={formData.labourCosts}
                    onChange={e => setFormData({ ...formData, labourCosts: e.target.value })}
                    placeholder="0"
                    step="0.01"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Calculated Preview */}
              <Card className="bg-sand border-burgundy/20">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Calculation Preview</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Income:</span>
                      <span className="font-semibold text-charcoal">{formatCurrency(parseFloat(formData.grossIncome) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                      <span className="font-semibold text-burgundy">
                        -{formatCurrency(((parseFloat(formData.grossIncome) || 0) * (parseFloat(formData.taxRate) || 0)) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labour Costs:</span>
                      <span className="font-semibold text-burgundy">-{formatCurrency(parseFloat(formData.labourCosts) || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-burgundy/20">
                      <span className="font-semibold text-gray-700">Net Profit:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(
                          (parseFloat(formData.grossIncome) || 0) -
                          (((parseFloat(formData.grossIncome) || 0) * (parseFloat(formData.taxRate) || 0)) / 100) -
                          (parseFloat(formData.labourCosts) || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Notes (Optional)
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-burgundy hover:bg-burgundy/90 text-white h-10 gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><FileText className="w-4 h-4" /> {editingId ? "Update Record" : "Create Record"}</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit overflow-x-auto">
        {([
          { key: "tax", label: "Tax", Icon: Receipt },
          { key: "profit", label: "Profit After Tax", Icon: TrendingUp },
          { key: "labour", label: "Labour Costs", Icon: Users },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === key
                ? "bg-white text-charcoal shadow-sm"
                : "text-gray-500 hover:text-charcoal"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Records Table */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-0">
          {finances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Briefcase className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-sm font-medium">No financial records yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Record" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gross Income
                    </th>
                    {activeTab === "tax" && (
                      <>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tax Rate
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tax Amount
                        </th>
                      </>
                    )}
                    {activeTab === "labour" && (
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Labour Costs
                      </th>
                    )}
                    {activeTab === "profit" && (
                      <>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total Expenses
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Net Profit
                        </th>
                      </>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {finances.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {MONTHS[record.month - 1]} {record.year}
                          </p>
                          {record.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                              {record.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-charcoal">{formatCurrency(record.grossIncome)}</p>
                      </td>
                      {activeTab === "tax" && (
                        <>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm text-gray-600">{record.taxRate}%</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-semibold text-burgundy">{formatCurrency(record.taxAmount)}</p>
                          </td>
                        </>
                      )}
                      {activeTab === "labour" && (
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-semibold text-burgundy">{formatCurrency(record.labourCosts)}</p>
                        </td>
                      )}
                      {activeTab === "profit" && (
                        <>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm text-gray-600">{formatCurrency(record.taxAmount + record.labourCosts)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-bold text-green-600">{formatCurrency(record.netProfit)}</p>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(record)}
                            className="h-8 px-2 text-gray-400 hover:text-burgundy"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(record.id)}
                            className="h-8 px-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
