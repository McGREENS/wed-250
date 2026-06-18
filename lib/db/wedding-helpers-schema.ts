// Wedding Helpers table (people assigned to help with wedding tasks)
export const weddingHelpers = sqliteTable("wedding_helpers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  weddingId: text("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role"), // e.g., "Best Man", "Maid of Honor", "Coordinator", etc.
  assignedTasks: text("assigned_tasks"), // JSON array of task IDs
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const weddingHelpersRelations = relations(weddingHelpers, ({ one }) => ({
  wedding: one(weddings, { fields: [weddingHelpers.weddingId], references: [weddings.id] }),
}));
