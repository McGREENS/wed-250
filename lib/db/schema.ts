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
  category: text("category").notNull(), // Single category or "Multi Service Provider"
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
  calendarPublished: integer("calendar_published", { mode: "boolean" }).default(false),
  maxBookingsPerDay: integer("max_bookings_per_day").default(1), // New field: max bookings allowed per day (default 1)
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
  partnerUserId: text("partner_user_id").references(() => users.id, { onDelete: "set null" }),
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

// Wedding Helpers table
export const weddingHelpers = sqliteTable("wedding_helpers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  weddingId: text("wedding_id").notNull().references(() => weddings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role"),
  assignedTasks: text("assigned_tasks"), // JSON array of task strings
  helperUserId: text("helper_user_id").references(() => users.id, { onDelete: "set null" }),
  accessToken: text("access_token").unique(),
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
  assignedHelperId: text("assigned_helper_id").references(() => weddingHelpers.id, { onDelete: "set null" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
  priority: text("priority").default("medium"),
  notes: text("notes"),
  category: text("category").default("General"),
  quantity: real("quantity"),
  unitPrice: real("unit_price"),
  deposit: real("deposit"),
  marketPrice: real("market_price"),
  progress: text("progress").default("not_started"), // not_started | in_progress | done
  vendorName: text("vendor_name"),
  vendorBooked: integer("vendor_booked", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Helper Task Progress table
export const helperTaskProgress = sqliteTable("helper_task_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  helperId: text("helper_id").notNull().references(() => weddingHelpers.id, { onDelete: "cascade" }),
  taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed"] }).default("pending").notNull(),
  comments: text("comments"), // JSON array of comment objects
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

// Pending Vendor Signups table (for OTP verification)
export const pendingVendorSignups = sqliteTable("pending_vendor_signups", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceCategory: text("service_category").notNull(),
  password: text("password").notNull(), // hashed
  otp: text("otp").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  metadata: text("metadata"), // JSON for referral code
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Pending Couple Signups table (for OTP verification)
export const pendingCoupleSignups = sqliteTable("pending_couple_signups", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(), // hashed
  weddingDate: text("wedding_date"), // ISO string, optional
  otp: text("otp").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  metadata: text("metadata"), // JSON for referral code
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Conversations table (chat threads between vendor and couple)
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  coupleId: text("couple_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Messages table
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Public Referral Links table (reusable links)
export const publicReferralLinks = sqliteTable("public_referral_links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referralCode: text("referral_code").notNull().unique(),
  referralRole: text("referral_role", { enum: ["COUPLE", "VENDOR"] }).notNull(),
  title: text("title"),
  description: text("description"),
  usageCount: integer("usage_count").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Booking Payments table
export const bookingPayments = sqliteTable("booking_payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  note: text("note"),
  paidAt: integer("paid_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Manual Expenses table (for vendors/expenses outside the platform)
export const manualExpenses = sqliteTable("manual_expenses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // "Venue", "Photography", "Catering", etc.
  vendorName: text("vendor_name").notNull(),
  amount: real("amount").notNull(),
  note: text("note"),
  paidAt: integer("paid_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Referrals table
export const referrals = sqliteTable("referrals", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  referrerId: text("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referralCode: text("referral_code").notNull().unique(),
  referredEmail: text("referred_email").notNull(),
  referredName: text("referred_name"),
  referredRole: text("referred_role", { enum: ["COUPLE", "VENDOR"] }).notNull(),
  referredUserId: text("referred_user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status", { enum: ["PENDING", "ACCEPTED", "EXPIRED", "CANCELLED"] }).default("PENDING").notNull(),
  emailSent: integer("email_sent", { mode: "boolean" }).default(false),
  emailSentAt: integer("email_sent_at", { mode: "timestamp" }),
  acceptedAt: integer("accepted_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  publicLinkId: text("public_link_id").references(() => publicReferralLinks.id, { onDelete: "set null" }),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});



export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, { fields: [vendors.userId], references: [users.id] }),
  venues: many(venues),
  bookings: many(bookings),
  reviews: many(reviews),
  servicePackages: many(servicePackages),
  invoices: many(invoices),
  finances: many(vendorFinances),
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
  helpers: many(weddingHelpers),
}));

export const weddingHelpersRelations = relations(weddingHelpers, ({ one, many }) => ({
  wedding: one(weddings, { fields: [weddingHelpers.weddingId], references: [weddings.id] }),
  taskProgress: many(helperTaskProgress),
}));

export const helperTaskProgressRelations = relations(helperTaskProgress, ({ one }) => ({
  helper: one(weddingHelpers, { fields: [helperTaskProgress.helperId], references: [weddingHelpers.id] }),
}));

export const bookingPaymentsRelations = relations(bookingPayments, ({ one }) => ({
  booking: one(bookings, { fields: [bookingPayments.bookingId], references: [bookings.id] }),
}));

export const manualExpensesRelations = relations(manualExpenses, ({ one }) => ({
  user: one(users, { fields: [manualExpenses.userId], references: [users.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  wedding: one(weddings, { fields: [bookings.weddingId], references: [weddings.id] }),
  vendor: one(vendors, { fields: [bookings.vendorId], references: [vendors.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  payments: many(bookingPayments),
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

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  vendor: one(vendors, { fields: [conversations.vendorId], references: [vendors.id] }),
  couple: one(users, { fields: [conversations.coupleId], references: [users.id] }),
  booking: one(bookings, { fields: [conversations.bookingId], references: [bookings.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const publicReferralLinksRelations = relations(publicReferralLinks, ({ one, many }) => ({
  user: one(users, { fields: [publicReferralLinks.userId], references: [users.id] }),
  referrals: many(referrals),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, { fields: [referrals.referrerId], references: [users.id] }),
  referredUser: one(users, { fields: [referrals.referredUserId], references: [users.id] }),
  publicLink: one(publicReferralLinks, { fields: [referrals.publicLinkId], references: [publicReferralLinks.id] }),
}));

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
  invoices: many(invoices),
  publicReferralLinks: many(publicReferralLinks),
  manualExpenses: many(manualExpenses),
}));

// Invoices table
export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceNumber: text("invoice_number").notNull().unique(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  clientId: text("client_id").references(() => users.id, { onDelete: "set null" }),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  clientAddress: text("client_address"),
  issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  subtotal: real("subtotal").notNull(),
  taxRate: real("tax_rate").default(18),
  taxAmount: real("tax_amount").notNull(),
  discount: real("discount").default(0),
  total: real("total").notNull(),
  status: text("status", { enum: ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"] }).default("DRAFT").notNull(),
  color: text("color").default("#8B4513"),
  notes: text("notes"),
  terms: text("terms"),
  items: text("items").notNull(), // JSON array of invoice items
  paidAt: integer("paid_at", { mode: "timestamp" }),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  vendor: one(vendors, { fields: [invoices.vendorId], references: [vendors.id] }),
  booking: one(bookings, { fields: [invoices.bookingId], references: [bookings.id] }),
  client: one(users, { fields: [invoices.clientId], references: [users.id] }),
}));

// Vendor Finances table (manual income tracking)
export const vendorFinances = sqliteTable("vendor_finances", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  grossIncome: real("gross_income").notNull().default(0), // Manual input by vendor
  taxRate: real("tax_rate").notNull().default(18), // Rwanda VAT is 18%
  taxAmount: real("tax_amount").notNull().default(0), // Calculated: grossIncome * (taxRate/100)
  labourCosts: real("labour_costs").notNull().default(0), // Manual input
  netProfit: real("net_profit").notNull().default(0), // Calculated: grossIncome - taxAmount - labourCosts
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const vendorFinancesRelations = relations(vendorFinances, ({ one }) => ({
  vendor: one(vendors, { fields: [vendorFinances.vendorId], references: [vendors.id] }),
}));
