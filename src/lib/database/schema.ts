import { pgTable, text, timestamp, integer, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  subscriptionStatus: text('subscription_status', { enum: ['active', 'inactive', 'cancelled'] }).default('active').notNull(),
  preferences: json('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login').defaultNow().notNull()
});

// Courses table
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  level: text('level', { enum: ['beginner', 'intermediate', 'expert'] }).notNull(),
  language: text('language').notNull(),
  modules: json('modules').notNull(),
  learningOutcomes: json('learning_outcomes').notNull(),
  thumbnail: text('thumbnail'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  publicShareId: text('public_share_id').unique(),
  tags: json('tags'),
  estimatedDuration: integer('estimated_duration').default(0).notNull(), // in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Exports table
export const exports = pgTable('exports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  format: text('format', { enum: ['pdf', 'powerpoint', 'scorm'] }).notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  downloadUrl: text('download_url'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  planId: text('plan_id').notNull(),
  status: text('status', { enum: ['active', 'cancelled', 'past_due', 'unpaid'] }).notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  paymentProvider: text('payment_provider', { enum: ['stripe', 'razorpay'] }).notNull(),
  paymentProviderId: text('payment_provider_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // in cents
  currency: text('currency').default('usd').notNull(),
  status: text('status', { enum: ['pending', 'succeeded', 'failed', 'refunded'] }).notNull(),
  paymentProvider: text('payment_provider', { enum: ['stripe', 'razorpay'] }).notNull(),
  paymentProviderId: text('payment_provider_id').notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// AI Usage table
export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  aiModel: text('ai_model').notNull(),
  tokensUsed: integer('tokens_used').notNull(),
  cost: integer('cost').notNull(), // in cents
  generationTime: integer('generation_time').notNull(), // in milliseconds
  success: boolean('success').default(true).notNull(),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Admin Settings table
export const adminSettings = pgTable('admin_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  value: json('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  exports: many(exports),
  subscriptions: many(subscriptions),
  payments: many(payments),
  aiUsage: many(aiUsage)
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id]
  }),
  exports: many(exports),
  aiUsage: many(aiUsage)
}));

export const exportsRelations = relations(exports, ({ one }) => ({
  user: one(users, {
    fields: [exports.userId],
    references: [users.id]
  }),
  course: one(courses, {
    fields: [exports.courseId],
    references: [courses.id]
  })
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  }),
  payments: many(payments)
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id]
  })
}));

export const aiUsageRelations = relations(aiUsage, ({ one }) => ({
  user: one(users, {
    fields: [aiUsage.userId],
    references: [users.id]
  }),
  course: one(courses, {
    fields: [aiUsage.courseId],
    references: [courses.id]
  })
})); 