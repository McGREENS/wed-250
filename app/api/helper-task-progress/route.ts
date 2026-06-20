import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weddingHelpers, helperTaskProgress, tasks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const helperId = searchParams.get("helperId");

    if (!token && !helperId) {
      return NextResponse.json({ error: "Missing token or helperId" }, { status: 400 });
    }

    let helper;
    if (token) {
      [helper] = await db.select().from(weddingHelpers).where(eq(weddingHelpers.accessToken, token)).limit(1);
    } else if (helperId) {
      [helper] = await db.select().from(weddingHelpers).where(eq(weddingHelpers.id, helperId)).limit(1);
    }

    if (!helper) {
      return NextResponse.json({ error: "Helper not found" }, { status: 404 });
    }

    const progress = await db.select().from(helperTaskProgress).where(eq(helperTaskProgress.helperId, helper.id));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching task progress:", error);
    return NextResponse.json({ error: "Failed to fetch task progress" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, helperId, taskId, taskName, status, comment } = body;

    if (!token && !helperId) {
      return NextResponse.json({ error: "Missing token or helperId" }, { status: 400 });
    }

    if (!taskId && !taskName) {
      return NextResponse.json({ error: "Task ID or name is required" }, { status: 400 });
    }

    let helper;
    if (token) {
      [helper] = await db.select().from(weddingHelpers).where(eq(weddingHelpers.accessToken, token)).limit(1);
    } else if (helperId) {
      [helper] = await db.select().from(weddingHelpers).where(eq(weddingHelpers.id, helperId)).limit(1);
    }

    if (!helper) {
      return NextResponse.json({ error: "Helper not found" }, { status: 404 });
    }

    // Check if progress entry exists (by taskId if available, otherwise by taskName)
    let existing;
    if (taskId) {
      [existing] = await db.select()
        .from(helperTaskProgress)
        .where(and(
          eq(helperTaskProgress.helperId, helper.id),
          eq(helperTaskProgress.taskId, taskId)
        ))
        .limit(1);
    } else {
      [existing] = await db.select()
        .from(helperTaskProgress)
        .where(and(
          eq(helperTaskProgress.helperId, helper.id),
          eq(helperTaskProgress.taskName, taskName)
        ))
        .limit(1);
    }

    if (existing) {
      // Update existing
      let comments = [];
      if (existing.comments) {
        try {
          comments = JSON.parse(existing.comments);
        } catch (e) {
          comments = [];
        }
      }

      if (comment) {
        comments.push({
          text: comment,
          timestamp: new Date().toISOString(),
        });
      }

      const [updated] = await db.update(helperTaskProgress)
        .set({
          status: status || existing.status,
          comments: JSON.stringify(comments),
          taskId: taskId || existing.taskId,
          updatedAt: new Date(),
        } as any)
        .where(eq(helperTaskProgress.id, existing.id))
        .returning();

      // Sync with main tasks table if status is completed
      if (taskId && status === "completed") {
        await db.update(tasks)
          .set({ completed: true, updatedAt: new Date() } as any)
          .where(eq(tasks.id, taskId));
      } else if (taskId && (status === "pending" || status === "in_progress")) {
        await db.update(tasks)
          .set({ completed: false, updatedAt: new Date() } as any)
          .where(eq(tasks.id, taskId));
      }

      return NextResponse.json({ progress: updated });
    } else {
      // Create new
      const comments = comment ? [{ text: comment, timestamp: new Date().toISOString() }] : [];
      
      const [newProgress] = await db.insert(helperTaskProgress)
        .values({
          helperId: helper.id,
          taskId: taskId || null,
          taskName: taskName || '',
          status: status || "pending",
          comments: JSON.stringify(comments),
        } as any)
        .returning();

      // Sync with main tasks table if status is completed
      if (taskId && status === "completed") {
        await db.update(tasks)
          .set({ completed: true, updatedAt: new Date() } as any)
          .where(eq(tasks.id, taskId));
      }

      return NextResponse.json({ progress: newProgress });
    }
  } catch (error) {
    console.error("Error updating task progress:", error);
    return NextResponse.json({ error: "Failed to update task progress" }, { status: 500 });
  }
}
