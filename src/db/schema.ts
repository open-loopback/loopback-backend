import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // clerk uid
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sourceId: text("source_id").notNull(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  source: uuid("source")
    .notNull()
    .references(() => sources.id),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const WebhookEventEnum = pgEnum("webhook_event", ["feedback.created"]);
// delivery status
export const deliveryStatusEnum = pgEnum("delivery_status", ["pending", "success", "failed"]);

export const webhooks = pgTable("webhooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  // array of sources this webhook is subscribed to
  sources: uuid("sources").array(),
  url: text("url").notNull(),
  event: WebhookEventEnum("event").notNull(),
  secret: text("secret").notNull(), // HMAC signing secret
  isActive: boolean("is_active").default(true),
  // delivery status
  deliveryStatus: deliveryStatusEnum("delivery_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const webhookDeliveries = pgTable("webhook_deliveries", {
  id: uuid("id").defaultRandom().primaryKey(),
  webhookId: uuid("webhook_id")
    .notNull()
    .references(() => webhooks.id, { onDelete: "cascade" }),
  feedbackId: uuid("feedback_id")
    .notNull()
    .references(() => feedbacks.id, { onDelete: "cascade" }),
  status: deliveryStatusEnum("status").notNull().default("pending"),
  response: jsonb("response"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});