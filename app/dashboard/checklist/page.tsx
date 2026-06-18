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
  });

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
        // Update existing task
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
        // Create new task
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
  const timelines = ['12 months before', '9 months before', '6 months before', '3 months before', '1 month before', 'Custom'];

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
          <p className="text-sm text-gray-600">Manage your wedding tasks and assign helpers</p>
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

        <div className="space-y-6">
          {timelines.map(timeline => {
            const timelineTasks = tasks.filter(t => t.timeline === timeline);
            if (timelineTasks.length === 0) return null;

            return (
              <Card key={timeline} className="border-gold/20 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-gold/8 via-cream to-sand/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">{timeline}</h3>
                    <span className="text-sm text-gray-600">
                      {timelineTasks.filter(t => t.completed).length}/{timelineTasks.length} complete
                    </span>
                  </div>
                  <div className="space-y-2">
                    {timelineTasks.map(task => {
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
            );
          })}

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
        </div>

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
