"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Plus, Trash2, Edit2, X, Calendar, User, Loader2 } from 'lucide-react';
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
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title) return;
    setLoading(true);
    await onSave({ 
      ...form, 
      category,
      assignedHelperId: form.assignedHelperId || null 
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
    const colors: Record<string, { bg: string; border: string; text: string; progress: string }> = {
      'Traditional (Gusaba)': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800', progress: 'bg-purple-600' },
      'Civil Ceremony': { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800', progress: 'bg-blue-600' },
      'Church Wedding': { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-800', progress: 'bg-indigo-600' },
      'Reception': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800', progress: 'bg-amber-600' },
      'Gutwikurura': { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-800', progress: 'bg-rose-600' },
    };
    return colors[category] || { bg: 'bg-burgundy-100', border: 'border-burgundy-400', text: 'text-burgundy-800', progress: 'bg-burgundy-600' };
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

        <div className="mb-6">
          <p className="text-sm text-gray-600">Click on a category to view and add tasks</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {sortedCategories.map(category => {
            const stats = getCategoryStats(category);
            const colors = getCategoryColor(category);
            const isExpanded = expandedCategory === category;

            return (
              <Card 
                key={category} 
                className={`border-2 ${colors.border} shadow-md hover:shadow-xl transition-all cursor-pointer ${colors.bg}`}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1">
                      <h3 className={`font-bold text-xs ${colors.text}`}>{category}</h3>
                      <p className="text-[10px] text-gray-600">{stats.total} {stats.total === 1 ? 'task' : 'tasks'}</p>
                    </div>
                    <div className={`text-base font-bold ${colors.text}`}>{stats.percentage}%</div>
                  </div>
                  
                  <div className="space-y-0.5 mb-1">
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>{stats.completed} done</span>
                      <span>{stats.total - stats.completed} left</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full ${colors.progress} transition-all duration-500`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>

                  <button 
                    className={`text-[10px] font-medium ${colors.text} hover:underline flex items-center gap-1`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCategory(isExpanded ? null : category);
                    }}
                  >
                    {isExpanded ? '▲ Hide' : '▼ View'}
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
                <div className="flex gap-2">
                  <Button 
                    onClick={() => { setEditingTask(null); setShowModal(true); }}
                    size="sm"
                    className="bg-burgundy text-white hover:bg-burgundy/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                  <button 
                    onClick={() => setExpandedCategory(null)}
                    className="text-gray-500 hover:text-charcoal transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {tasks.filter(t => (t.category || 'Traditional (Gusaba)') === expandedCategory).length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No tasks in this category yet. Click "Add Task" to create one.
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
                          <div className="flex gap-1 flex-shrink-0">
                            {task.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
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
