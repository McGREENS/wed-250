"use client";

import UserPageLayout from '@/app/components/user/UserPageLayout';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Progress } from "@/app/components/ui/progress";
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ChecklistPage() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Set wedding budget', timeline: '12 months before', completed: true, custom: false },
        { id: 2, title: 'Create guest list', timeline: '12 months before', completed: true, custom: false },
        { id: 3, title: 'Book venue', timeline: '12 months before', completed: true, custom: false },
        { id: 4, title: 'Book photographer', timeline: '9 months before', completed: false, custom: false },
        { id: 5, title: 'Order wedding dress', timeline: '6 months before', completed: false, custom: false },
        { id: 6, title: 'Book caterer', timeline: '6 months before', completed: false, custom: false },
        { id: 7, title: 'Send invitations', timeline: '3 months before', completed: false, custom: false },
    ]);

    const [newTask, setNewTask] = useState('');

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), title: newTask, timeline: 'Custom', completed: false, custom: true }]);
            setNewTask('');
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / tasks.length) * 100);

    const timelines = ['12 months before', '9 months before', '6 months before', '3 months before', 'Custom'];

    return (
        <UserPageLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Wedding Checklist</h1>
                    <p className="text-gray-600">Stay organized with your wedding planning timeline</p>
                </div>

                <Card className="border-gray-100 shadow-sm mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal">Overall Progress</h3>
                                <p className="text-sm text-gray-600">{completedCount} of {tasks.length} tasks completed</p>
                            </div>
                            <div className="text-3xl font-bold text-burgundy">{progress}%</div>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-charcoal mb-4">Add Custom Task</h3>
                        <div className="flex gap-2">
                            <Input placeholder="Enter task name..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} className="flex-1" />
                            <Button onClick={addTask} className="bg-burgundy text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Task
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {timelines.map(timeline => {
                        const timelineTasks = tasks.filter(t => t.timeline === timeline);
                        if (timelineTasks.length === 0) return null;

                        return (
                            <Card key={timeline} className="border-gray-100 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-charcoal">{timeline}</h3>
                                        <span className="text-sm text-gray-600">
                                            {timelineTasks.filter(t => t.completed).length}/{timelineTasks.length} complete
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {timelineTasks.map(task => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 bg-sand/20 rounded-lg">
                                                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-5 h-5 text-burgundy rounded cursor-pointer" />
                                                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-charcoal'}`}>{task.title}</span>
                                                {task.custom && (
                                                    <Button variant="ghost" size="sm" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </UserPageLayout>
    );
}
