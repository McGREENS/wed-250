"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardCheck, Calendar, User, Mail, Phone, Loader2, CheckCircle2, Heart, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface HelperTask {
  id: string;
  weddingId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  assignedTasks: Array<{
    id: string;
    title: string;
    timeline: string;
    completed: boolean;
    dueDate?: string | null;
    priority?: string;
    notes?: string;
    expectedBudget?: number | null;
    custom?: boolean;
    userId?: string;
    assignedHelperId?: string | null;
    category?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
  wedding: {
    coupleNames: string;
    weddingDate: string;
    budget: number;
    guestCount: number;
  };
}

interface TaskProgress {
  id: string;
  taskId: string;
  taskName: string;
  status: "pending" | "in_progress" | "completed";
  comments: string;
}

interface Comment {
  text: string;
  timestamp: string;
}

export default function HelperTasksPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [tasks, setTasks] = useState<HelperTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskProgress, setTaskProgress] = useState<Record<string, TaskProgress>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Access denied. Please use the magic link sent to your email.");
      setLoading(false);
      return;
    }
    fetchHelperTasks();
    fetchTaskProgress();
  }, [token]);

  const fetchHelperTasks = async () => {
    try {
      const url = `/api/helper-tasks?token=${token}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setTasks(data.tasks || []);
      } else {
        setError(data.error || "Failed to load tasks");
      }
    } catch (err) {
      setError("Failed to load your tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskProgress = async () => {
    try {
      const res = await fetch(`/api/helper-task-progress?token=${token}`);
      const data = await res.json();

      if (res.ok) {
        const progressMap: Record<string, TaskProgress> = {};
        data.progress?.forEach((p: TaskProgress) => {
          // Use taskId as key for better lookup
          progressMap[p.taskId] = p;
        });
        setTaskProgress(progressMap);
      }
    } catch (err) {
      console.error("Failed to load task progress", err);
    }
  };

  const updateTaskStatus = async (taskId: string, taskName: string, newStatus: "pending" | "in_progress" | "completed") => {
    setUpdatingTask(taskId);
    try {
      const res = await fetch("/api/helper-task-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, taskId, taskName, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchTaskProgress();
        toast.success("Status updated");
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingTask(null);
    }
  };

  const addComment = async (taskId: string, taskName: string) => {
    const comment = commentInputs[taskId]?.trim();
    if (!comment) return;

    setUpdatingTask(taskId);
    try {
      const res = await fetch("/api/helper-task-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, taskId, taskName, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchTaskProgress();
        setCommentInputs({ ...commentInputs, [taskId]: "" });
        toast.success("Comment added");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setUpdatingTask(null);
    }
  };

  const content = (
    <div className="max-w-5xl mx-auto">
      {loading && (
        <div className="text-center bg-white rounded-xl p-8 shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-burgundy mx-auto mb-4" />
          <p className="text-charcoal font-medium">Loading your tasks...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl text-white">!</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Access Error</h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-block px-8 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-all font-medium shadow-lg"
            >
              Login to View Tasks
            </a>
          </div>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-burgundy to-burgundy/80 p-6">
            <ClipboardCheck className="w-16 h-16 text-white/80 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white text-center">No Tasks Yet</h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600">You haven't been assigned to any wedding tasks yet.</p>
          </div>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <>
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-burgundy to-burgundy/80 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ClipboardCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Your Wedding Helper Tasks</h1>
            <p className="text-gray-600 text-sm md:text-base">Thank you for helping make these weddings special</p>
            
            {/* Summary stats */}
            {tasks.length > 1 && (
              <div className="mt-6 flex justify-center gap-4 flex-wrap">
                <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                  <p className="text-xs text-gray-500 mb-1">Weddings</p>
                  <p className="text-2xl font-bold text-burgundy">{tasks.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                  <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-burgundy">
                    {tasks.reduce((sum, t) => sum + t.assignedTasks.length, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Object.values(taskProgress).filter(p => p.status === "completed").length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                  <p className="text-xs text-gray-500 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.values(taskProgress).filter(p => p.status === "in_progress").length}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {tasks.map((task) => {
              const weddingDate = new Date(task.wedding.weddingDate);
              const formattedDate = weddingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={task.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-burgundy via-burgundy to-burgundy/90 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-6 h-6 text-white/80" />
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{task.wedding.coupleNames}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm md:text-base font-medium">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                      <div className="bg-sand/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4 text-burgundy" />
                          <span className="font-semibold">Your Role</span>
                        </div>
                        <p className="text-charcoal font-medium text-lg">{task.role || "Wedding Helper"}</p>
                      </div>

                      {task.wedding.guestCount > 0 && (
                        <div className="bg-sand/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Expected Guests</span>
                          </div>
                          <p className="text-charcoal font-medium text-lg">{task.wedding.guestCount} guests</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-sand/20 to-burgundy/5 rounded-xl p-6">
                      <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-burgundy" />
                        Your Assigned Tasks
                      </h3>
                      {task.assignedTasks.length > 0 ? (
                        <ul className="space-y-4">
                          {task.assignedTasks.map((taskItem, index) => {
                            const progress = taskProgress[taskItem.id];
                            const status = progress?.status || "pending";
                            const comments: Comment[] = progress?.comments ? JSON.parse(progress.comments) : [];

                            return (
                              <li key={taskItem.id} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3 mb-3">
                                  <span className="w-7 h-7 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 shadow-md">
                                    {index + 1}
                                  </span>
                                  <div className="flex-1">
                                    <div className="mb-2">
                                      <p className="text-gray-700 font-medium">{taskItem.title}</p>
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        {taskItem.timeline && (
                                          <span className="text-xs text-gray-500">{taskItem.timeline}</span>
                                        )}
                                        {taskItem.priority && (
                                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            taskItem.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            taskItem.priority === 'low' ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'
                                          }`}>{taskItem.priority}</span>
                                        )}
                                        {taskItem.custom && (
                                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Custom</span>
                                        )}
                                        {taskItem.dueDate && (
                                          <span className="text-xs text-red-600">
                                            Due: {new Date(taskItem.dueDate).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      {taskItem.expectedBudget != null && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                                          <span>💰</span>
                                          <span>Budget: {taskItem.expectedBudget.toLocaleString()} RWF</span>
                                        </div>
                                      )}
                                      {taskItem.notes && (
                                        <p className="mt-2 text-xs text-gray-500 italic">{taskItem.notes}</p>
                                      )}
                                    </div>
                                    
                                    <div className="flex gap-2 mb-3">
                                      <button
                                        onClick={() => updateTaskStatus(taskItem.id, taskItem.title, "pending")}
                                        disabled={updatingTask === taskItem.id}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                          status === "pending"
                                            ? "bg-gray-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                      >
                                        Pending
                                      </button>
                                      <button
                                        onClick={() => updateTaskStatus(taskItem.id, taskItem.title, "in_progress")}
                                        disabled={updatingTask === taskItem.id}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                          status === "in_progress"
                                            ? "bg-blue-500 text-white"
                                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                        }`}
                                      >
                                        In Progress
                                      </button>
                                      <button
                                        onClick={() => updateTaskStatus(taskItem.id, taskItem.title, "completed")}
                                        disabled={updatingTask === taskItem.id}
                                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                          status === "completed"
                                            ? "bg-green-500 text-white"
                                            : "bg-green-100 text-green-600 hover:bg-green-200"
                                        }`}
                                      >
                                        Completed
                                      </button>
                                    </div>

                                    {comments.length > 0 && (
                                      <div className="bg-sand/10 rounded-lg p-3 mb-3 space-y-2">
                                        {comments.map((c, i) => (
                                          <div key={i} className="text-sm">
                                            <p className="text-gray-700">{c.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              {new Date(c.timestamp).toLocaleString()}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentInputs[taskItem.id] || ""}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [taskItem.id]: e.target.value })}
                                        onKeyPress={(e) => e.key === "Enter" && addComment(taskItem.id, taskItem.title)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                                        disabled={updatingTask === taskItem.id}
                                      />
                                      <button
                                        onClick={() => addComment(taskItem.id, taskItem.title)}
                                        disabled={updatingTask === taskItem.id || !commentInputs[taskItem.id]?.trim()}
                                        className="px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Send className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No specific tasks assigned yet</p>
                      )}
                    </div>

                    {(task.email || task.phone) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Need to reach out?</p>
                        <div className="flex flex-wrap gap-3">
                          {task.email && (
                            <a
                              href={`mailto:${task.email}`}
                              className="flex items-center gap-2 px-4 py-2 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-white rounded-lg transition-all text-sm font-medium"
                            >
                              <Mail className="w-4 h-4" />
                              <span className="hidden sm:inline">{task.email}</span>
                              <span className="sm:hidden">Email</span>
                            </a>
                          )}
                          {task.phone && (
                            <a
                              href={`tel:${task.phone}`}
                              className="flex items-center gap-2 px-4 py-2 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-white rounded-lg transition-all text-sm font-medium"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="hidden sm:inline">{task.phone}</span>
                              <span className="sm:hidden">Call</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {token && (
            <div className="mt-8 text-center">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <p className="text-gray-700 mb-4 font-medium">
                  Have an Andiza account? Login to access your helper tasks anytime
                </p>
                <a
                  href="/login"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-burgundy to-burgundy/90 text-white rounded-lg hover:shadow-xl transition-all font-medium"
                >
                  Login to Your Account
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand/30 via-white to-burgundy/5 py-8 md:py-12 px-4">
      {content}
    </div>
  );
}
