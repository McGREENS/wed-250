import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { weddingHelpers, weddings, tasks } from "@/lib/db/schema";
import { eq, or, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    let helperTasks = [];

    if (token) {
      // Access via magic link token - find the helper by this token first
      const [tokenHelper] = await db
        .select({
          email: weddingHelpers.email,
        })
        .from(weddingHelpers)
        .where(eq(weddingHelpers.accessToken, token))
        .limit(1);

      if (!tokenHelper || !tokenHelper.email) {
        return NextResponse.json(
          { error: "Invalid or expired access link" },
          { status: 404 }
        );
      }

      // Now fetch ALL helper assignments for this email across all weddings
      const helpers = await db
        .select({
          id: weddingHelpers.id,
          weddingId: weddingHelpers.weddingId,
          name: weddingHelpers.name,
          email: weddingHelpers.email,
          phone: weddingHelpers.phone,
          role: weddingHelpers.role,
          wedding: {
            coupleNames: weddings.coupleNames,
            weddingDate: weddings.weddingDate,
            budget: weddings.budget,
            guestCount: weddings.guestCount,
            userId: weddings.userId,
          },
        })
        .from(weddingHelpers)
        .innerJoin(weddings, eq(weddingHelpers.weddingId, weddings.id))
        .where(eq(weddingHelpers.email, tokenHelper.email));

      // Fetch assigned tasks for each helper from the tasks table
      const helpersWithTasks = await Promise.all(
        helpers.map(async (h) => {
          const assignedTasks = await db
            .select()
            .from(tasks)
            .where(
              and(
                eq(tasks.userId, h.wedding.userId),
                eq(tasks.assignedHelperId, h.id)
              )
            );
          return {
            ...h,
            assignedTasks,
          };
        })
      );

      helperTasks = helpersWithTasks;
    } else {
      // Access via authenticated user
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Find all helpers linked to this user's ID or email
      const helpers = await db
        .select({
          id: weddingHelpers.id,
          weddingId: weddingHelpers.weddingId,
          name: weddingHelpers.name,
          email: weddingHelpers.email,
          phone: weddingHelpers.phone,
          role: weddingHelpers.role,
          wedding: {
            coupleNames: weddings.coupleNames,
            weddingDate: weddings.weddingDate,
            budget: weddings.budget,
            guestCount: weddings.guestCount,
            userId: weddings.userId,
          },
        })
        .from(weddingHelpers)
        .innerJoin(weddings, eq(weddingHelpers.weddingId, weddings.id))
        .where(
          or(
            eq(weddingHelpers.helperUserId, session.user.id),
            eq(weddingHelpers.email, session.user.email!)
          )
        );

      // Fetch assigned tasks for each helper from the tasks table
      const helpersWithTasks = await Promise.all(
        helpers.map(async (h) => {
          const assignedTasks = await db
            .select()
            .from(tasks)
            .where(
              and(
                eq(tasks.userId, h.wedding.userId),
                eq(tasks.assignedHelperId, h.id)
              )
            );
          return {
            ...h,
            assignedTasks,
          };
        })
      );

      helperTasks = helpersWithTasks;
    }

    // Remove duplicates based on id
    const uniqueTasks = helperTasks.filter((task, index, self) =>
      index === self.findIndex((t) => t.id === task.id)
    );

    return NextResponse.json({ tasks: uniqueTasks });
  } catch (error) {
    console.error("Error fetching helper tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch helper tasks" },
      { status: 500 }
    );
  }
}
