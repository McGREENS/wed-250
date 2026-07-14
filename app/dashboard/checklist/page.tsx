"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  timeline: string;
  completed: boolean;
  custom: boolean;
  assignedHelperId?: string | null;
  priority?: string;
  notes?: string;
  category?: string;
  quantity?: number | null;
  unitPrice?: number | null;
  deposit?: number | null;
  marketPrice?: number | null;
}

interface Helper {
  id: string;
  name: string;
  role: string;
}

function TaskModal({ task, category, helpers, onSave, onCancel }: {
  task: Task | null;
  category: string;
  helpers: Helper[];
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: task?.title || '',
    assignedHelperId: task?.assignedHelperId || '',
    priority: task?.priority || 'medium',
    quantity: task?.quantity != null ? String(task.quantity) : '',
    unitPrice: task?.unitPrice != null ? String(task.unitPrice) : '',
    deposit: task?.deposit != null ? String(task.deposit) : '',
    marketPrice: task?.marketPrice != null ? String(task.marketPrice) : '',
  });
  const [loading, setLoading] = useState(false);

  const total = form.quantity !== '' && form.unitPrice !== ''
    ? parseFloat(form.quantity) * parseFloat(form.unitPrice)
    : null;
  const balance = total != null && form.deposit !== ''
    ? total - parseFloat(form.deposit)
    : total;

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    await onSave({
      ...form,
      category,
      assignedHelperId: form.assignedHelperId || null,
      quantity: form.quantity !== '' ? parseFloat(form.quantity) : null,
      unitPrice: form.unitPrice !== '' ? parseFloat(form.unitPrice) : null,
      deposit: form.deposit !== '' ? parseFloat(form.deposit) : null,
      marketPrice: form.marketPrice !== '' ? parseFloat(form.marketPrice) : null,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-charcoal">{task ? 'Edit task' : `Add task to ${category}`}</h3>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <Label className="text-sm font-medium mb-2">Task Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Book photographer"
              className="border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium mb-2">Quantity</Label>
              <Input type="number" min="0" value={form.quantity}
                onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 2" className="border-gray-200" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Unit Price (RWF)</Label>
              <Input type="number" min="0" value={form.unitPrice}
                onChange={(e) => setForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                placeholder="e.g., 50000" className="border-gray-200" />
            </div>
          </div>

          {total != null && (
            <div className="bg-sand/40 rounded-lg px-4 py-2 flex items-center justify-between text-sm">
              <span className="text-charcoal/70">Total</span>
              <span className="font-semibold text-charcoal">{total.toLocaleString()} RWF</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium mb-2">Deposit (RWF)</Label>
              <Input type="number" min="0" value={form.deposit}
                onChange={(e) => setForm(prev => ({ ...prev, deposit: e.target.value }))}
                placeholder="e.g., 20000" className="border-gray-200" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Price on Market (RWF)</Label>
              <Input type="number" min="0" value={form.marketPrice}
                onChange={(e) => setForm(prev => ({ ...prev, marketPrice: e.target.value }))}
                placeholder="e.g., 60000" className="border-gray-200" />
            </div>
          </div>

          {balance != null && (
            <div className="bg-burgundy/5 rounded-lg px-4 py-2 flex items-center justify-between text-sm">
              <span className="text-charcoal/70">Balance</span>
              <span className="font-semibold text-burgundy">{balance.toLocaleString()} RWF</span>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium mb-2">Helper</Label>
            <select
              value={form.assignedHelperId}
              onChange={(e) => setForm(prev => ({ ...prev, assignedHelperId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">No helper assigned</option>
              {helpers.map(h => (
                <option key={h.id} value={h.id}>{h.name}{h.role ? ` (${h.role})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Urgency</Label>
            <select
              value={form.priority}
              onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" disabled={loading}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.title || loading}
            className="bg-burgundy text-white hover:bg-burgundy/90"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ['Traditional (Gusaba)', 'Civil Ceremony', 'Church Wedding', 'Reception', 'Gutwikurura'];

const CATEGORY_COLORS: Record<string, { image: string; border: string; text: string; subtext: string; progress: string; activeBorder: string }> = {
  'Traditional (Gusaba)': { image: '/traditional.jpeg', border: 'border-[#7a3d52]', text: 'text-white', subtext: 'text-white/80', progress: 'bg-rose-300', activeBorder: 'border-rose-300 ring-2 ring-rose-300/50' },
  'Civil Ceremony':       { image: '/civil.jpeg',       border: 'border-[#3a5080]', text: 'text-white', subtext: 'text-white/80', progress: 'bg-blue-300',  activeBorder: 'border-blue-300 ring-2 ring-blue-300/50' },
  'Church Wedding':       { image: '/church.jpeg',      border: 'border-[#4a4580]', text: 'text-white', subtext: 'text-white/80', progress: 'bg-indigo-300',activeBorder: 'border-indigo-300 ring-2 ring-indigo-300/50' },
  'Reception':            { image: '/reception.jpeg',   border: 'border-[#7a5520]', text: 'text-white', subtext: 'text-white/80', progress: 'bg-amber-300', activeBorder: 'border-amber-300 ring-2 ring-amber-300/50' },
  'Gutwikurura':          { image: '/wediing.jpg',      border: 'border-[#4a7040]', text: 'text-white', subtext: 'text-white/80', progress: 'bg-emerald-300',activeBorder: 'border-emerald-300 ring-2 ring-emerald-300/50' },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Traditional (Gusaba)');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, helpersRes] = await Promise.all([
        fetch('/api/dashboard/tasks'),
        fetch('/api/wedding-helpers'),
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (helpersRes.ok) {
        const data = await helpersRes.json();
        setHelpers(data.map((h: any) => ({ id: h.id, name: h.name, role: h.role })));
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const res = await fetch('/api/dashboard/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, completed: !task.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === task.id ? { ...t, ...updated } : t));
      }
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        const res = await fetch('/api/dashboard/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTask.id, ...taskData }),
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
          toast.success('Task updated!');
        }
      } else {
        const res = await fetch('/api/dashboard/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          const newTask = await res.json();
          setTasks([...tasks, newTask]);
          toast.success('Task created!');
        }
      }
      setShowModal(false);
      setEditingTask(null);
    } catch {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
        toast.success('Task deleted');
      }
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const getHelperName = (helperId?: string | null) => helpers.find(h => h.id === helperId)?.name ?? null;

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
        </div>
      </UserPageLayout>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getCategoryStats = (category: string) => {
    const cat = tasks.filter(t => (t.category || 'Traditional (Gusaba)') === category);
    const completed = cat.filter(t => t.completed).length;
    const total = cat.length;
    const subTotal = cat.reduce((sum, t) => sum + (t.quantity ?? 1) * (t.unitPrice ?? 0), 0);
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0, subTotal };
  };

  return (
    <UserPageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Checklist</h1>
          <p className="text-gray-600">Track every task and expense across your wedding events</p>
        </div>

        <Card className="border-burgundy/20 shadow-sm mb-8 bg-gradient-to-br from-burgundy/12 via-burgundy/5 to-cream">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-charcoal">Overall Progress</h3>
                <p className="text-sm text-charcoal/70">{completedCount} of {tasks.length} tasks completed</p>
              </div>
              <div className="text-3xl font-bold text-burgundy">{progress}%</div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {helpers.length === 0 && (
          <Card className="border-sand bg-gradient-to-br from-sand via-sand/60 to-cream mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-charcoal/80">
                💡 Tip: Add wedding helpers in <a href="/dashboard/wedding-settings" className="underline font-medium text-burgundy">Wedding Settings</a> to assign tasks to friends and family.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Category cards */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => {
            const stats = getCategoryStats(category);
            const colors = CATEGORY_COLORS[category];
            const isExpanded = expandedCategory === category;
            return (
              <Card
                key={category}
                className={`border flex-shrink-0 w-36 sm:flex-1 ${colors.border} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden relative ${isExpanded ? colors.activeBorder : ''}`}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                style={{ backgroundImage: `url(${colors.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/55" />
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-semibold text-xs leading-tight ${colors.text} drop-shadow`}>{category}</h3>
                    <div className={`text-sm font-bold ${colors.text} opacity-90 drop-shadow`}>{stats.percentage}%</div>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full ${colors.progress} transition-all duration-500`} style={{ width: `${stats.percentage}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-[10px] ${colors.subtext} drop-shadow`}>{stats.completed}/{stats.total} done</p>
                    <p className={`text-[10px] font-medium ${colors.text} opacity-80`}>{isExpanded ? '▲' : '▼'}</p>
                  </div>
                  {stats.subTotal > 0 && (
                    <p className={`text-[9px] ${colors.subtext} drop-shadow mt-1 pt-1 border-t border-white/20`}>
                      Total: {fmt(stats.subTotal)} RWF
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Expanded category table */}
        {expandedCategory && (() => {
          const categoryTasks = tasks.filter(t => (t.category || 'Traditional (Gusaba)') === expandedCategory);
          const subTotal = categoryTasks.reduce((sum, t) => sum + (t.quantity ?? 1) * (t.unitPrice ?? 0), 0);
          const totalDeposit = categoryTasks.reduce((sum, t) => sum + (t.deposit ?? 0), 0);
          const totalBalance = categoryTasks.reduce((sum, t) => {
            const total = (t.quantity ?? 1) * (t.unitPrice ?? 0);
            return sum + (total - (t.deposit ?? 0));
          }, 0);

          return (
            <Card className="border-gold/20 shadow-lg bg-gradient-to-br from-gold/8 via-cream to-sand/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-charcoal">{expandedCategory}</h3>
                  <Button
                    onClick={() => { setEditingTask(null); setShowModal(true); }}
                    size="sm"
                    className="bg-burgundy text-white hover:bg-burgundy/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New task
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/30">
                        <th className="text-left py-2 pr-3 text-xs font-semibold text-charcoal/60 w-6"></th>
                        <th className="text-left py-2 pr-3 text-xs font-semibold text-charcoal/60 min-w-[160px]">Item</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-16">Qty</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-28">Unit Price</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-28">Total</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-28">Deposit</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-28">Balance</th>
                        <th className="text-right py-2 px-2 text-xs font-semibold text-charcoal/60 w-28">Market Price</th>
                        <th className="text-left py-2 px-2 text-xs font-semibold text-charcoal/60 w-24">Helper</th>
                        <th className="w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryTasks.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-gray-400 text-sm">
                            No tasks yet. Click "New task" to add one.
                          </td>
                        </tr>
                      ) : (
                        categoryTasks.map(task => {
                          const total = (task.quantity ?? 1) * (task.unitPrice ?? 0);
                          const balance = total - (task.deposit ?? 0);
                          const helperName = getHelperName(task.assignedHelperId);
                          return (
                            <tr
                              key={task.id}
                              className={`border-b border-sand/60 transition-colors ${task.completed ? 'bg-gold/10' : 'hover:bg-sand/30'}`}
                            >
                              <td className="py-2.5 pr-3">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(task)}
                                  className="w-4 h-4 text-burgundy rounded cursor-pointer"
                                />
                              </td>
                              <td className={`py-2.5 pr-3 font-medium ${task.completed ? 'line-through text-charcoal/40' : 'text-charcoal'}`}>
                                {task.title}
                              </td>
                              <td className="py-2.5 px-2 text-right text-charcoal/70">
                                {task.quantity != null ? task.quantity : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right text-charcoal/70">
                                {task.unitPrice != null ? task.unitPrice.toLocaleString() : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right font-medium text-charcoal">
                                {task.unitPrice != null ? total.toLocaleString() : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right text-emerald-700">
                                {task.deposit != null ? task.deposit.toLocaleString() : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right text-burgundy font-medium">
                                {task.unitPrice != null ? balance.toLocaleString() : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-right text-charcoal/50">
                                {task.marketPrice != null ? task.marketPrice.toLocaleString() : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 px-2 text-xs text-charcoal/60">
                                {helperName ?? <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-2.5 pl-2">
                                <div className="flex gap-1 justify-end">
                                  <Button variant="ghost" size="sm" onClick={() => { setEditingTask(task); setShowModal(true); }} className="h-7 w-7 p-0">
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} className="h-7 w-7 p-0 text-red-400 hover:text-red-600">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    {categoryTasks.length > 0 && (
                      <tfoot>
                        <tr className="border-t-2 border-gold/40 bg-gold/10">
                          <td colSpan={4} className="py-3 pr-3 text-sm font-bold text-charcoal">Sub Total</td>
                          <td className="py-3 px-2 text-right font-bold text-charcoal">{subTotal > 0 ? subTotal.toLocaleString() : '—'}</td>
                          <td className="py-3 px-2 text-right font-bold text-emerald-700">{totalDeposit > 0 ? totalDeposit.toLocaleString() : '—'}</td>
                          <td className="py-3 px-2 text-right font-bold text-burgundy">{totalBalance > 0 ? totalBalance.toLocaleString() : '—'}</td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {showModal && expandedCategory && (
          <TaskModal
            task={editingTask}
            category={expandedCategory}
            helpers={helpers}
            onSave={handleSaveTask}
            onCancel={() => { setShowModal(false); setEditingTask(null); }}
          />
        )}
      </div>
    </UserPageLayout>
  );
}
