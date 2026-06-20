import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { tasks as tasksTable } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId)).orderBy(desc(tasksTable.createdAt));

    // If no tasks exist, create default tasks
    if (userTasks.length === 0) {
      const defaultTasks = [
        { title: 'Set wedding budget', timeline: '12 months before', completed: false, custom: false },
        { title: 'Create guest list', timeline: '12 months before', completed: false, custom: false },
        { title: 'Book venue', timeline: '12 months before', completed: false, custom: false },
        { title: 'Book photographer', timeline: '9 months before', completed: false, custom: false },
        { title: 'Order wedding dress', timeline: '6 months before', completed: false, custom: false },
        { title: 'Book caterer', timeline: '6 months before', completed: false, custom: false },
        { title: 'Send invitations', timeline: '3 months before', completed: false, custom: false },
      ];

      await db.insert(tasksTable).values(defaultTasks.map(task => ({
        userId,
        title: task.title,
        timeline: task.timeline,
        completed: task.completed,
        custom: task.custom,
      })) as any);

      // Fetch the newly created tasks
      const newTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId)).orderBy(desc(tasksTable.createdAt));
      return NextResponse.json(newTasks);
    }

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, timeline = 'Custom', category = 'General', assignedHelperId, dueDate, priority = 'medium', notes } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newTask = await db.insert(tasksTable).values({
      userId: session.user.id,
      title,
      timeline,
      category: category || 'General',
      assignedHelperId: assignedHelperId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'medium',
      notes: notes || null,
      custom: true,
    } as any).returning();

    return NextResponse.json(newTask[0]);
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, completed } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updatedTask = await db.update(tasksTable)
      .set({ 
        updatedAt: new Date(), 
        completed: sql`${completed}` 
      } as any)
      .where(eq(tasksTable.id, id))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, timeline, category, assignedHelperId, dueDate, priority, notes } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updatedTask = await db.update(tasksTable)
      .set({
        title,
        timeline,
        category: category || 'General',
        assignedHelperId: assignedHelperId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        notes: notes || null,
        updatedAt: new Date(),
      } as any)
      .where(eq(tasksTable.id, id))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await db.delete(tasksTable).where(eq(tasksTable.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}