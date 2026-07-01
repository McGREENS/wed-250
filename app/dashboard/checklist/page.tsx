"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Plus, Trash2, Edit2, Calendar, User, Loader2 } from 'lucide-react';
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
  expectedBudget?: number | null;
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
  onCancel: () => void 
}) {
  const [form, setForm] = useState({
    title: task?.title || '',
    assignedHelperId: task?.assignedHelperId || '',
    priority: task?.priority || 'medium',
    expectedBudget: task?.expectedBudget != null ? String(task.expectedBudget) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    await onSave({ 
      ...form, 
      category,
      assignedHelperId: form.assignedHelperId || null,
      expectedBudget: form.expectedBudget !== '' ? parseFloat(form.expectedBudget) : null,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-charcoal">Adding task to {category}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2">Task Title</Label>
            <Input 
              value={form.title} 
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g., Book photographer"
              className="border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Helper</Label>
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

          <div>
            <Label className="text-sm font-medium mb-2">Expected Budget (RWF)</Label>
            <Input
              type="number"
              value={form.expectedBudget}
              onChange={(e) => setForm(prev => ({ ...prev, expectedBudget: e.target.value }))}
              placeholder="e.g., 500000"
              className="border-gray-200"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!form.title || loading}
            className="bg-burgundy text-white hover:bg-burgundy/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Task'
            )}
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Traditional (Gusaba)');

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

  const handleDeleteTask = async (id: string) => {
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
  
  const allowedCategories = ['Traditional (Gusaba)', 'Civil Ceremony', 'Church Wedding', 'Reception', 'Gutwikurura'];
  const sortedCategories = allowedCategories;

  const getCategoryStats = (category: string) => {
    const categoryTasks = tasks.filter(t => (t.category || 'Traditional (Gusaba)') === category);
    const completed = categoryTasks.filter(t => t.completed).length;
    const total = categoryTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { image: string; border: string; text: string; subtext: string; progress: string; activeBorder: string }> = {
      'Traditional (Gusaba)': {
        image: '/traditional.jpeg',
        border: 'border-[#7a3d52]',
        text: 'text-white',
        subtext: 'text-white/80',
        progress: 'bg-rose-300',
        activeBorder: 'border-rose-300 ring-2 ring-rose-300/50',
      },
      'Civil Ceremony': {
        image: '/civil.jpeg',
        border: 'border-[#3a5080]',
        text: 'text-white',
        subtext: 'text-white/80',
        progress: 'bg-blue-300',
        activeBorder: 'border-blue-300 ring-2 ring-blue-300/50',
      },
      'Church Wedding': {
        image: '/church.jpeg',
        border: 'border-[#4a4580]',
        text: 'text-white',
        subtext: 'text-white/80',
        progress: 'bg-indigo-300',
        activeBorder: 'border-indigo-300 ring-2 ring-indigo-300/50',
      },
      'Reception': {
        image: '/reception.jpeg',
        border: 'border-[#7a5520]',
        text: 'text-white',
        subtext: 'text-white/80',
        progress: 'bg-amber-300',
        activeBorder: 'border-amber-300 ring-2 ring-amber-300/50',
      },
      'Gutwikurura': {
        image: '/wediing.jpg',
        border: 'border-[#4a7040]',
        text: 'text-white',
        subtext: 'text-white/80',
        progress: 'bg-emerald-300',
        activeBorder: 'border-emerald-300 ring-2 ring-emerald-300/50',
      },
    };
    return colors[category] || {
      image: '/wediing.jpg',
      border: 'border-[#6b3030]',
      text: 'text-white',
      subtext: 'text-white/80',
      progress: 'bg-red-300',
      activeBorder: 'border-red-300 ring-2 ring-red-300/50',
    };
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

        {helpers.length === 0 && (
          <Card className="border-sand bg-gradient-to-br from-sand via-sand/60 to-cream mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-charcoal/80">
                💡 Tip: Add wedding helpers in <a href="/dashboard/wedding-settings" className="underline font-medium text-burgundy">Wedding Settings</a> to assign tasks to friends and family.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {sortedCategories.map(category => {
            const stats = getCategoryStats(category);
            const colors = getCategoryColor(category);
            const isExpanded = expandedCategory === category;

            return (
              <Card
                key={category}
                className={`border flex-shrink-0 w-36 sm:flex-1 ${colors.border} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden relative ${
                  isExpanded ? colors.activeBorder : ''
                }`}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                style={{ backgroundImage: `url(${colors.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-black/55" />
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-semibold text-xs leading-tight ${colors.text} drop-shadow`}>{category}</h3>
                    <div className={`text-sm font-bold ${colors.text} opacity-90 drop-shadow`}>{stats.percentage}%</div>
                  </div>

                  <div className="mb-3">
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${colors.progress} transition-all duration-500`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] ${colors.subtext} drop-shadow`}>{stats.completed}/{stats.total} done</p>
                    <p className={`text-[10px] font-medium ${colors.text} opacity-80`}>
                      {isExpanded ? '▲' : '▼'}
                    </p>
                  </div>
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
                <Button
                  onClick={() => { setEditingTask(null); setShowModal(true); }}
                  size="sm"
                  className="bg-burgundy text-white hover:bg-burgundy/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New task
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.filter(t => (t.category || 'Traditional (Gusaba)') === expandedCategory).length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No tasks in this category yet. Click "New task" to create one.
                  </div>
                ) : (
                  tasks.filter(t => (t.category || 'Traditional (Gusaba)') === expandedCategory).map(task => {
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
                            {task.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs text-charcoal/70 mt-2">
                            {task.timeline && (
                              <span className="flex items-center gap-1 bg-burgundy/10 text-burgundy px-2 py-1 rounded-full font-medium">
                                {task.timeline}
                              </span>
                            )}
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

                          {task.expectedBudget != null && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                              <span>💰</span>
                              <span>Budget: {Number(task.expectedBudget).toLocaleString()} RWF</span>
                            </div>
                          )}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
