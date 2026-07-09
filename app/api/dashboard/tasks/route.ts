import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { tasks as tasksTable, weddingHelpers, weddings } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { resolveOwnerUserId } from '@/lib/resolveOwner';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await resolveOwnerUserId(session.user.id);
    const userTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId)).orderBy(desc(tasksTable.createdAt));

    // No default tasks - user creates their own
    if (userTasks.length === 0) {
      return NextResponse.json([]);
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

    const { title, timeline = 'Custom', category = 'General', assignedHelperId, dueDate, priority = 'medium', notes, expectedBudget, budgetType = 'fixed', budgetPercent } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const helperIdToAssign = assignedHelperId && assignedHelperId !== '' ? assignedHelperId : null;

    const newTask = await db.insert(tasksTable).values({
      userId: await resolveOwnerUserId(session.user.id),
      title,
      timeline,
      category: category || 'General',
      assignedHelperId: helperIdToAssign,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'medium',
      notes: notes || null,
      expectedBudget: expectedBudget ? parseFloat(expectedBudget) : null,
      budgetType: budgetType || 'fixed',
      budgetPercent: budgetPercent ? parseFloat(budgetPercent) : null,
      custom: true,
    } as any).returning();

    // Send email notification if helper is assigned
    if (helperIdToAssign) {
      try {
        console.log('Attempting to send email for helper:', helperIdToAssign);
        
        const helper = await db.query.weddingHelpers.findFirst({
          where: eq(weddingHelpers.id, helperIdToAssign),
        });

        console.log('Helper found:', helper ? `${helper.name} (${helper.email})` : 'No helper found');

        if (helper && helper.email) {
          const wedding = await db.query.weddings.findFirst({
            where: eq(weddings.userId, await resolveOwnerUserId(session.user.id)),
          });

          console.log('Wedding found:', wedding ? wedding.coupleNames : 'No wedding found');

          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.cylacon.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
              user: process.env.SMTP_USER || 'andiza@cylacon.com',
              pass: process.env.SMTP_PASSWORD || '3fGapSreQA7BhVLJemFs',
            },
          });

          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          const magicLink = `${baseUrl}/helper-tasks?token=${helper.accessToken}`;

          const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
            <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                    <tr>
                      <td style="background:#8B3A3A;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
                        <p style="margin:0 0 6px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:2px;text-transform:uppercase;">New Task Assignment</p>
                        <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">You Have a New Task! 📋</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#fff;padding:36px 40px;border:1px solid #e8e8e8;border-top:none;">
                        <p style="margin:0 0 20px;font-size:15px;color:#444;">Hi <strong>${helper.name}</strong>,</p>
                        <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
                          A new task has been assigned to you for <strong>${wedding?.coupleNames || 'the wedding'}</strong>:
                        </p>
                        <div style="background:#fff8f0;border-left:4px solid #d97706;border-radius:0 8px 8px 0;padding:24px 28px;margin-bottom:28px;">
                          <p style="margin:0 0 8px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Task Details</p>
                          <p style="margin:0 0 12px;font-size:16px;color:#2C2C2C;font-weight:600;">${title}</p>
                          ${category ? `<p style="margin:0 0 6px;font-size:13px;color:#666;"><strong>Category:</strong> ${category}</p>` : ''}
                          ${priority ? `<p style="margin:0 0 6px;font-size:13px;color:#666;"><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</p>` : ''}
                        </div>
                        <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
                          <p style="margin:0 0 12px;font-size:14px;color:#15803d;font-weight:600;">📋 View Your Tasks</p>
                          <p style="margin:0 0 16px;font-size:13px;color:#166534;line-height:1.6;">Click below to view and update your task status:</p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr><td align="center" style="padding:8px 0;">
                              <a href="${magicLink}" style="display:inline-block;background:#8B3A3A;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">View My Tasks</a>
                            </td></tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f9f9f9;border:1px solid #e8e8e8;border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                        <p style="margin:0;font-size:12px;color:#aaa;">Andiza &mdash; Rwanda's Wedding Planning Platform</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
          `;

          console.log('Sending email to:', helper.email);
          
          const emailResult = await transporter.sendMail({
            from: '"Andiza" <andiza@cylacon.com>',
            to: helper.email,
            subject: `📋 New Task Assigned: ${title}`,
            html,
          });
          
          console.log('Email sent successfully:', emailResult.messageId);
        } else {
          console.log('Cannot send email - helper missing or no email address');
        }
      } catch (emailError) {
        console.error('Failed to send task assignment email:', emailError);
      }
    } else {
      console.log('No helper assigned to this task');
    }

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

    const { id, completed, actualSpent } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updatedTask = await db.update(tasksTable)
      .set({ 
        updatedAt: new Date(), 
        completed: sql`${completed}`,
        ...(actualSpent != null ? { actualSpent: parseFloat(actualSpent) } : {}),
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

    const { id, title, timeline, category, assignedHelperId, dueDate, priority, notes, expectedBudget, budgetType, budgetPercent, actualSpent } = await request.json();
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
        expectedBudget: expectedBudget ? parseFloat(expectedBudget) : null,
        budgetType: budgetType || 'fixed',
        budgetPercent: budgetPercent ? parseFloat(budgetPercent) : null,
        actualSpent: actualSpent != null ? parseFloat(actualSpent) : null,
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