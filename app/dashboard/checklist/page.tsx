"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Progress } from "@/app/components/ui/progress";
import { Plus, Trash2, Edit2, X, Save, Calendar, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  timeline: string;
  completed: boolean;
  custom: boolean;
  assignedHelperId?: string | null;
  dueDate?: string | null;
  priority?: string;
  notes?: string;
  category?: string;
}

interface Helper {
  id: string;
  name: string;
  role: string;
}

function TaskModal({ task, helpers, onSave, onCancel }: { 
  task: Task | null; 
  helpers: Helper[];
  onSave: (task: Partial<Task>) => void; 
  onCancel: () => void 
}) {
  const [form, setForm] = useState({
    title: task?.title || '',
    timeline: task?.timeline || '12 months before',
    assignedHelperId: task?.assignedHelperId || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'medium',
    notes: task?.notes || '',
    category: task?.category || 'General',
  });

  const predefinedCategories = [
    'General',
    'Introduction Ceremony',
    'Dowry Negotiation',
    'Bride Price Ceremony',
    'Civil Registration',
    'Wedding Reception',
    'Religious Ceremony',
    'Planning & Preparation',
    'Decorations & Setup',
    'Food & Catering',
    'Music & Entertainment',
    'Photography & Video',
    'Transportation',
    'Attire & Beauty',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-charcoal">{task ? 'Edit Task' : 'Create New Task'}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2">Task Title *</Label>
            <Input 
              value={form.title} 
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g., Book photographer"
              className="border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Category *</Label>
            <select 
              value={predefinedCategories.includes(form.category) ? form.category : 'custom'} 
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setForm(prev => ({ ...prev, category: '' }));
                } else {
                  setForm(prev => ({ ...prev, category: e.target.value }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
            >
              {predefinedCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">+ Create custom category</option>
            </select>
            {!predefinedCategories.includes(form.category) && (
              <Input 
                value={form.category} 
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} 
                placeholder="Enter custom category name"
                className="border-gray-200"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">Group tasks by wedding ceremony or phase</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2">Timeline</Label>
              <select 
                value={form.timeline} 
                onChange={(e) => setForm(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="12 months before">12 months before</option>
                <option value="9 months before">9 months before</option>
                <option value="6 months before">6 months before</option>
                <option value="3 months before">3 months before</option>
                <option value="1 month before">1 month before</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">Priority</Label>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2">Due Date (Optional)</Label>
              <Input 
                type="date"
                value={form.dueDate} 
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="border-gray-200"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">Assign Helper (Optional)</Label>
              <select 
                value={form.assignedHelperId} 
                onChange={(e) => setForm(prev => ({ ...prev, assignedHelperId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">No helper assigned</option>
                {helpers.map(h => (
                  <option key={h.id} value={h.id}>{h.name} {h.role ? `(${h.role})` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Notes (Optional)</Label>
            <Textarea 
              value={form.notes} 
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional details..."
              className="border-gray-200 min-h-[80px]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline">Cancel</Button>
          <Button 
            onClick={() => form.title && onSave(form)} 
            disabled={!form.title}
            className="bg-burgundy text-white hover:bg-burgundy/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, helpersRes] = await Promise.all([
        fetch('/api/dashboard/tasks'),
        fetch('/api/wedding-helpers')
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (helpersRes.ok) {
        const helpersData = await helpersRes.json();
        setHelpers(helpersData.map((h: any) => ({ id: h.id, name: h.name, role: h.role })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch('/api/dashboard/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
        toast.success(completed ? 'Task marked as incomplete' : 'Task completed!');
      }
    } catch (error) {
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
          toast.success('Task updated successfully!');
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
          toast.success('Task created successfully!');
        }
      }

      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string, custom: boolean) => {
    if (!custom) {
      toast.error('Cannot delete default tasks');
      return;
    }

    try {
      const res = await fetch(`/api/dashboard/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
        toast.success('Task deleted');
      }
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getHelperName = (helperId?: string | null) => {
    if (!helperId) return null;
    const helper = helpers.find(h => h.id === helperId);
    return helper ? helper.name : null;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
        </div>
      </UserPageLayout>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  const categories = [...new Set(tasks.map(t => t.category || 'General'))];
  const sortedCategories = categories.sort((a, b) => {
    if (a === 'General') return 1;
    if (b === 'General') return -1;
    return a.localeCompare(b);
  });

  const getCategoryStats = (category: string) => {
    const categoryTasks = tasks.filter(t => (t.category || 'General') === category);
    const completed = categoryTasks.filter(t => t.completed).length;
    const total = categoryTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; progress: string }> = {
      'Introduction Ceremony': { bg: 'from-purple-50 to-purple-100', border: 'border-purple-300', text: 'text-purple-700', progress: 'bg-purple-500' },
      'Dowry Negotiation': { bg: 'from-pink-50 to-pink-100', border: 'border-pink-300', text: 'text-pink-700', progress: 'bg-pink-500' },
      'Bride Price Ceremony': { bg: 'from-rose-50 to-rose-100', border: 'border-rose-300', text: 'text-rose-700', progress: 'bg-rose-500' },
      'Civil Registration': { bg: 'from-blue-50 to-blue-100', border: 'border-blue-300', text: 'text-blue-700', progress: 'bg-blue-500' },
      'Wedding Reception': { bg: 'from-amber-50 to-amber-100', border: 'border-amber-300', text: 'text-amber-700', progress: 'bg-amber-500' },
      'Religious Ceremony': { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700', progress: 'bg-indigo-500' },
      'Planning & Preparation': { bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700', progress: 'bg-cyan-500' },
      'Decorations & Setup': { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', progress: 'bg-emerald-500' },
      'Food & Catering': { bg: 'from-orange-50 to-orange-100', border: 'border-orange-300', text: 'text-orange-700', progress: 'bg-orange-500' },
      'Music & Entertainment': { bg: 'from-violet-50 to-violet-100', border: 'border-violet-300', text: 'text-violet-700', progress: 'bg-violet-500' },
      'Photography & Video': { bg: 'from-fuchsia-50 to-fuchsia-100', border: 'border-fuchsia-300', text: 'text-fuchsia-700', progress: 'bg-fuchsia-500' },
      'Transportation': { bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', text: 'text-slate-700', progress: 'bg-slate-500' },
      'Attire & Beauty': { bg: 'from-pink-50 to-pink-100', border: 'border-pink-300', text: 'text-pink-700', progress: 'bg-pink-500' },
      'General': { bg: 'from-gray-50 to-gray-100', border: 'border-gray-300', text: 'text-gray-700', progress: 'bg-gray-500' },
    };
    return colors[category] || { bg: 'from-burgundy-50 to-burgundy-100', border: 'border-burgundy-300', text: 'text-burgundy-700', progress: 'bg-burgundy-500' };
  };

  return (
    <UserPageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Checklist</h1>
          <p className="text-gray-600">Stay organized with your wedding planning timeline</p>
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

        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">Click on a category to view and manage tasks</p>
          <Button 
            onClick={() => { setEditingTask(null); setShowModal(true); }} 
            className="bg-burgundy text-white hover:bg-burgundy/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {helpers.length === 0 && (
          <Card className="border-sand bg-gradient-to-br from-sand via-sand/60 to-cream mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-charcoal/80">
                💡 Tip: Add wedding helpers in <a href="/dashboard/wedding-settings" className="underline font-medium text-burgundy">Wedding Settings</a> to assign tasks to friends and family.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {sortedCategories.map(category => {
            const stats = getCategoryStats(category);
            const colors = getCategoryColor(category);
            const isExpanded = expandedCategory === category;

            return (
              <Card 
                key={category} 
                className={`border-2 ${colors.border} shadow-md hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br ${colors.bg}`}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-bold text-base mb-1 ${colors.text}`}>{category}</h3>
                      <p className="text-xs text-gray-600">{stats.total} {stats.total === 1 ? 'task' : 'tasks'}</p>
                    </div>
                    <div className={`text-2xl font-bold ${colors.text}`}>{stats.percentage}%</div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{stats.completed} completed</span>
                      <span>{stats.total - stats.completed} remaining</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full ${colors.progress} transition-all duration-500`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button 
                    className={`text-xs font-medium ${colors.text} hover:underline flex items-center gap-1`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCategory(isExpanded ? null : category);
                    }}
                  >
                    {isExpanded ? '▲ Hide tasks' : '▼ View tasks'}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {expandedCategory && (
          <Card className="border-gold/20 shadow-lg bg-gradient-to-br from-gold/8 via-cream to-sand/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-charcoal">{expandedCategory}</h3>
                <button 
                  onClick={() => setExpandedCategory(null)}
                  className="text-gray-500 hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {tasks.filter(t => (t.category || 'General') === expandedCategory).map(task => {
                  const helperName = getHelperName(task.assignedHelperId);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                        task.completed ? 'bg-gold/20 border border-gold/30' : 'bg-sand/40 border border-sand hover:bg-sand/50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleTask(task.id, task.completed)} 
                        className="w-5 h-5 text-burgundy rounded cursor-pointer mt-0.5 flex-shrink-0" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className={`font-medium ${
                            task.completed ? 'line-through text-charcoal/50' : 'text-charcoal'
                          }`}>
                            {task.title}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            {task.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-charcoal/70 mt-2">
                          <span className="flex items-center gap-1 bg-burgundy/10 text-burgundy px-2 py-1 rounded-full font-medium">
                            {task.timeline}
                          </span>
                          {helperName && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {helperName}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className={`flex items-center gap-1 ${
                              isOverdue ? 'text-red-600 font-medium' : ''
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                              {isOverdue && ' (Overdue)'}
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-xs text-charcoal/80 mt-2 p-2 bg-cream/50 rounded border border-sand italic">{task.notes}</p>
                        )}
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setEditingTask(task); setShowModal(true); }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        {task.custom && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteTask(task.id, task.custom)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {tasks.length === 0 && (
          <Card className="border-sand shadow-sm bg-gradient-to-br from-sand/40 via-cream to-sand/20">
            <CardContent className="p-12 text-center">
              <p className="text-charcoal/70 mb-4">No tasks yet. Click "Add Task" to get started!</p>
              <Button 
                onClick={() => setShowModal(true)} 
                className="bg-burgundy text-white hover:bg-burgundy/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        )}

        {showModal && (
          <TaskModal
            task={editingTask}
            helpers={helpers}
            onSave={handleSaveTask}
            onCancel={() => { setShowModal(false); setEditingTask(null); }}
          />
        )}
      </div>
    </UserPageLayout>
  );
}
