"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar, Save, Heart, Users, Plus, Trash2, Edit2, X, Mail, Phone, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DiscoverBanner from '@/app/components/dashboard/DiscoverBanner';

interface WeddingDetails {
  id?: string;
  coupleNames: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  notes: string;
}

interface Helper {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface TaskProgress {
  taskId: string;
  taskName: string;
  status: "pending" | "in_progress" | "completed";
  comments: string;
}

interface ChecklistTask {
  id: string;
  title: string;
  assignedHelperId?: string | null;
}

interface Comment {
  text: string;
  timestamp: string;
}

function HelperForm({ helper, tasks, onSave, onCancel }: { 
  helper: Helper | null; 
  tasks: ChecklistTask[];
  onSave: (h: Helper) => void; 
  onCancel: () => void 
}) {
  const [form, setForm] = useState<Helper>(helper || { name: '', email: '', phone: '', role: '' });

  return (
    <div className="border border-burgundy/20 rounded-lg p-6 mb-6 bg-burgundy/5">
      <h3 className="font-medium text-charcoal mb-4">{helper ? 'Edit Helper' : 'Add New Helper'}</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm">Name *</Label>
          <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Helper name" />
        </div>
        <div>
          <Label className="text-sm">Role</Label>
          <Input value={form.role} onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))} placeholder="e.g., Best Friend, Cousin" />
        </div>
        <div>
          <Label className="text-sm">Email</Label>
          <Input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="email@example.com" />
        </div>
        <div>
          <Label className="text-sm">Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+250..." />
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> After adding this helper, go to <a href="/dashboard/checklist" className="underline font-medium">Checklist</a> to assign specific tasks to them.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => form.name && onSave(form)} className="bg-burgundy text-white hover:bg-burgundy/90">Save</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

export default function WeddingSettingsPage() {
  const [wedding, setWedding] = useState<WeddingDetails>({
    coupleNames: '',
    weddingDate: '',
    budget: 0,
    guestCount: 0,
    notes: ''
  });
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [helperProgress, setHelperProgress] = useState<Record<string, TaskProgress[]>>({});
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>([]);
  const [editingHelper, setEditingHelper] = useState<Helper | null>(null);
  const [showHelperForm, setShowHelperForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weddingRes, helpersRes, tasksRes] = await Promise.all([
          fetch('/api/wedding-settings'),
          fetch('/api/wedding-helpers'),
          fetch('/api/dashboard/tasks')
        ]);

        if (weddingRes.ok) {
          const data = await weddingRes.json();
          if (data) {
            setWedding({
              id: data.id,
              coupleNames: data.coupleNames || '',
              weddingDate: data.weddingDate ? new Date(data.weddingDate).toISOString().split('T')[0] : '',
              budget: data.budget || 0,
              guestCount: data.guestCount || 0,
              notes: data.notes || ''
            });
          }
        }

        if (helpersRes.ok) {
          const helpersData = await helpersRes.json();
          setHelpers(helpersData);

          // Fetch progress for each helper
          const progressPromises = helpersData.map((h: Helper) => 
            fetch(`/api/helper-task-progress?helperId=${h.id}`).then(r => r.json())
          );
          const progressResults = await Promise.all(progressPromises);
          
          const progressMap: Record<string, TaskProgress[]> = {};
          helpersData.forEach((h: Helper, i: number) => {
            if (progressResults[i]?.progress) {
              progressMap[h.id!] = progressResults[i].progress;
            }
          });
          setHelperProgress(progressMap);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setChecklistTasks(tasksData.map((t: any) => ({ 
            id: t.id, 
            title: t.title, 
            assignedHelperId: t.assignedHelperId 
          })));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!wedding.coupleNames || !wedding.weddingDate) {
      toast.error('Please fill in couple names and wedding date');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/wedding-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wedding),
      });

      if (response.ok) {
        const savedWedding = await response.json();
        setWedding(prev => ({ ...prev, id: savedWedding.id }));
        toast.success('Wedding details saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save wedding details');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save wedding details');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof WeddingDetails, value: string | number) => {
    setWedding(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveHelper = async (helper: Helper) => {
    try {
      const method = helper.id ? 'PUT' : 'POST';
      const response = await fetch('/api/wedding-helpers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...helper, weddingDetails: wedding }),
      });

      if (response.ok) {
        const saved = await response.json();
        
        if (helper.id) {
          setHelpers(prev => prev.map(h => h.id === helper.id ? saved : h));
          toast.success('Helper updated successfully!');
        } else {
          setHelpers(prev => [...prev, saved]);
          toast.success('Helper added and notified via email!');
        }
        
        setShowHelperForm(false);
        setEditingHelper(null);
      }
    } catch (error) {
      toast.error('Failed to save helper');
    }
  };

  const handleDeleteHelper = async (id: string) => {
    try {
      const response = await fetch(`/api/wedding-helpers?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setHelpers(prev => prev.filter(h => h.id !== id));
        toast.success('Helper removed');
      }
    } catch (error) {
      toast.error('Failed to delete helper');
    }
  };

  if (loading) {
    return (
      <UserPageLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Settings</h1>
          <p className="text-gray-600">Set up your wedding details for personalized planning</p>
        </div>

        <DiscoverBanner />

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-burgundy" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">Wedding Details</h2>
                  <p className="text-sm text-gray-600">Configure your wedding information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coupleNames" className="text-sm font-medium text-charcoal">
                    Couple Names *
                  </Label>
                  <Input
                    id="coupleNames"
                    placeholder="e.g., John & Jane Smith"
                    value={wedding.coupleNames}
                    onChange={(e) => handleInputChange('coupleNames', e.target.value)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">This will appear on your dashboard and documents</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingDate" className="text-sm font-medium text-charcoal">
                    Wedding Date *
                  </Label>
                  <div className="relative">
                    <Input
                      id="weddingDate"
                      type="date"
                      value={wedding.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                      className="border-gray-200 focus:border-burgundy pl-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-gray-500">Used for countdown and timeline planning</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-charcoal">
                    Total Budget (RWF)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={wedding.budget || ''}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">Optional: helps track spending progress</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-sm font-medium text-charcoal">
                    Expected Guest Count
                  </Label>
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="0"
                    value={wedding.guestCount || ''}
                    onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 0)}
                    className="border-gray-200 focus:border-burgundy"
                  />
                  <p className="text-xs text-gray-500">Helps vendors provide accurate quotes</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-charcoal">
                  Wedding Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes about your wedding (theme, preferences, special requirements...)"
                  value={wedding.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-gray-200 focus:border-burgundy min-h-[100px]"
                />
                <p className="text-xs text-gray-500">Optional: additional details about your wedding vision</p>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button
                  onClick={handleSave}
                  disabled={saving || !wedding.coupleNames || !wedding.weddingDate}
                  className="bg-burgundy text-white hover:bg-burgundy/90 px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Wedding Details'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm mt-6">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-burgundy" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">Wedding Helpers</h2>
                  <p className="text-sm text-gray-600">Assign tasks to friends and family</p>
                </div>
              </div>
              <Button onClick={() => { setEditingHelper(null); setShowHelperForm(true); }} className="bg-burgundy text-white hover:bg-burgundy/90">
                <Plus className="w-4 h-4 mr-2" /> Add Helper
              </Button>
            </div>

            {showHelperForm && (
              <HelperForm
                helper={editingHelper}
                tasks={checklistTasks}
                onSave={handleSaveHelper}
                onCancel={() => { setShowHelperForm(false); setEditingHelper(null); }}
              />
            )}

            <div className="space-y-3">
              {helpers.map(helper => {
                const assignedTasks = checklistTasks.filter(t => t.assignedHelperId === helper.id);
                const progress = helperProgress[helper.id!] || [];
                const getTaskStatus = (taskId: string) => {
                  const taskProg = progress.find(p => p.taskId === taskId);
                  return taskProg?.status || "pending";
                };
                const getTaskComments = (taskId: string): Comment[] => {
                  const taskProg = progress.find(p => p.taskId === taskId);
                  if (!taskProg?.comments) return [];
                  try {
                    return JSON.parse(taskProg.comments);
                  } catch {
                    return [];
                  }
                };
                const completedCount = assignedTasks.filter(t => getTaskStatus(t.id) === "completed").length;
                const totalCount = assignedTasks.length;
                const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div key={helper.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal">{helper.name}</h3>
                        <p className="text-sm text-gray-600">{helper.role}</p>
                        <div className="mt-2 text-sm text-gray-500 space-y-1">
                          {helper.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{helper.email}</span>
                            </div>
                          )}
                          {helper.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{helper.phone}</span>
                            </div>
                          )}
                        </div>
                        {assignedTasks.length > 0 ? (
                          <div className="mt-3">
                            <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-1">Overall Progress</p>
                              <p className="text-lg font-semibold text-charcoal">{completedCount} of {totalCount} tasks completed</p>
                              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-burgundy transition-all" style={{ width: `${progressPercent}%` }}></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{progressPercent}%</p>
                            </div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Assigned Tasks ({assignedTasks.length}):</p>
                            <div className="space-y-2">
                              {assignedTasks.map((task) => {
                                const status = getTaskStatus(task.id);
                                const comments = getTaskComments(task.id);
                                
                                return (
                                  <div key={task.id} className="bg-sand/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      {status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                      {status === "in_progress" && <Clock className="w-4 h-4 text-blue-600" />}
                                      {status === "pending" && <Circle className="w-4 h-4 text-gray-400" />}
                                      <span className="text-sm font-medium text-charcoal">{task.title}</span>
                                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                                        status === "completed" ? "bg-green-100 text-green-700" :
                                        status === "in_progress" ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-600"
                                      }`}>
                                        {status === "completed" ? "Completed" : status === "in_progress" ? "In Progress" : "Pending"}
                                      </span>
                                    </div>
                                    {comments.length > 0 && (
                                      <div className="mt-2 pl-6 space-y-1">
                                        {comments.map((c, ci) => (
                                          <div key={ci} className="text-xs bg-white rounded p-2">
                                            <p className="text-gray-700">{c.text}</p>
                                            <p className="text-gray-400 mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800">
                              No tasks assigned yet. Go to <a href="/dashboard/checklist" className="underline font-medium">Checklist</a> to assign tasks.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingHelper(helper); setShowHelperForm(true); }}>
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteHelper(helper.id!)}>
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {helpers.length === 0 && !showHelperForm && (
                <p className="text-center text-gray-500 py-8">No helpers added yet. Click "Add Helper" to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-sand/20 rounded-lg">
          <h3 className="font-medium text-charcoal mb-2">💡 How It Works</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Add helpers here with their contact information</li>
            <li>• Go to <a href="/dashboard/checklist" className="underline font-medium text-burgundy">Checklist</a> to assign specific tasks to each helper</li>
            <li>• Helpers receive a magic link via email to view and update their tasks</li>
            <li>• Track progress and comments from helpers right here</li>
          </ul>
        </div>
      </div>
    </UserPageLayout>
  );
}
