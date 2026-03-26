import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  password: text("password").notNull(),
  role: text("role", { enum: ["COUPLE", "VENDOR", "ADMIN"] }).default("COUPLE").notNull(),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Accounts table (OAuth)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// Verification tokens
export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// Vendors table
export const vendors = sqliteTable("vendors", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name").notNull(),
  categories: text("categories").notNull(), // JSON array: ["Photography", "Catering", "Venues"]
  description: text("description"),
  location: text("location"),
  priceRange: text("price_range"),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  featured: integer("featured", { mode: "boolean" }).default(false),
  verified: integer("verified", { mode: "boolean" }).default(false),
  images: text("images"), // JSON array
  portfolio: text("portfolio"), // JSON array
  services: text("services"), // JSON array - DEPRECATED, use servicePackages table
  availability: text("availability"), // JSON object
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Venues table
export const venues = sqliteTable("venues", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  capacity: integer("capacity").notNull(),
  maxCapacity: integer("max_capacity"),
  venueType: text("venue_type"), // indoor, outdoor, garden, ballroom
  pricePerDay: real("price_per_day"),
  amenities: text("amenities"), // JSON array
  images: text("images"), // JSON array
  featured: integer("featured", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Weddings table
export const weddings = sqliteTable("weddings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  coupleNames: text("couple_names").notNull(),
  weddingDate: integer("wedding_date", { mode: "timestamp" }),
  venueId: text("venue_id").references(() => venues.id),
  budget: real("budget").default(0),
  guestCount: integer("guest_count").default(0),
  status: text("status", { enum: ["PLANNING", "CONFIRMED", "COMPLETED", "CANCELLED"] }).default("PLANNING"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  weddingId: text("wedding_id").references(() => weddings.id, { onDelete: "cascade" }),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  eventType: text("event_type"),
  servicePackage: text("service_package"),
  serviceType: text("service_type"),
  bookingDate: integer("booking_date", { mode: "timestamp" }),
  eventDate: integer("event_date", { mode: "timestamp" }),
  status: text("status").default("pending"),
  totalAmount: real("total_amount"),
  amount: real("amount"),
  depositAmount: real("deposit_amount"),
  paymentStatus: text("payment_status", { enum: ["UNPAID", "DEPOSIT_PAID", "PAID"] }).default("UNPAID"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  vendorId: text("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
  venueId: text("venue_id").references(() => venues.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  images: text("images"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Favorites table
export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  vendorId: text("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
  venueId: text("venue_id"), // Can reference venues.id OR servicePackages.id for venue services
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Venue Tours table
export const venueTours = sqliteTable("venue_tours", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  venueId: text("venue_id").notNull(), // servicePackage ID for venues
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  tourDate: integer("tour_date", { mode: "timestamp" }).notNull(),
  tourTime: text("tour_time").notNull(),
  status: text("status", { enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] }).default("PENDING"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Service Packages table
export const servicePackages = sqliteTable("service_packages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  serviceType: text("service_type").notNull(), // "Photography", "Catering", "Venue", "Decoration", "Music", "Planning", etc.
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  features: text("features"), // JSON array
  metadata: text("metadata"), // JSON object for service-specific fields
  image: text("image"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  timeline: text("timeline").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  custom: integer("custom", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Contact Messages table
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status", { enum: ["UNREAD", "READ", "REPLIED"] }).default("UNREAD"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  weddings: many(weddings),
  bookings: many(bookings),
  reviews: many(reviews),
  favorites: many(favorites),
  vendor: many(vendors),
  venueTours: many(venueTours),
  tasks: many(tasks),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, { fields: [vendors.userId], references: [users.id] }),
  venues: many(venues),
  bookings: many(bookings),
  reviews: many(reviews),
  servicePackages: many(servicePackages),
}));

export const venuesRelations = relations(venues, ({ one, many }) => ({
  vendor: one(vendors, { fields: [venues.vendorId], references: [vendors.id] }),
  weddings: many(weddings),
  reviews: many(reviews),
}));

export const weddingsRelations = relations(weddings, ({ one, many }) => ({
  user: one(users, { fields: [weddings.userId], references: [users.id] }),
  venue: one(venues, { fields: [weddings.venueId], references: [venues.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  wedding: one(weddings, { fields: [bookings.weddingId], references: [weddings.id] }),
  vendor: one(vendors, { fields: [bookings.vendorId], references: [vendors.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  vendor: one(vendors, { fields: [reviews.vendorId], references: [vendors.id] }),
  venue: one(venues, { fields: [reviews.venueId], references: [venues.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  vendor: one(vendors, { fields: [favorites.vendorId], references: [vendors.id] }),
  venue: one(venues, { fields: [favorites.venueId], references: [venues.id] }),
}));

export const venueToursRelations = relations(venueTours, ({ one }) => ({
  user: one(users, { fields: [venueTours.userId], references: [users.id] }),
}));

export const servicePackagesRelations = relations(servicePackages, ({ one }) => ({
  vendor: one(vendors, { fields: [servicePackages.vendorId], references: [vendors.id] }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));
