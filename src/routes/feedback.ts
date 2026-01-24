import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import { string, object, number, record, any } from "zod";
import { eq } from "drizzle-orm";

import { feedbacks, sources, webhooks, webhookDeliveries } from "../db/schema.js";
import { db } from "../db/index.js";

const MAX_FEEDBACK_LENGTH = 1000;

const schema = object({
  sourceId: string().min(1),
  feedbackText: string().min(1).max(MAX_FEEDBACK_LENGTH),
  rating: number().min(1).max(5),
  metadata: record(string(), any()).optional(),
});

export const feedbackRoute = new Hono()
  .get("/", (c) => {
    return c.json({ message: "Feedback route is accessible via GET" }, 200);
  })
  .post("/", sValidator("json", schema), async (c) => {
    const feedbackData = c.req.valid("json");

    // get the source from the database
    const source = await db
      .select()
      .from(sources)
      .where(eq(sources.sourceId, feedbackData.sourceId));

    if (source.length === 0) {
      return c.json({ error: "Source not found" }, 404);
    }

    // add feedback
    const [insertedFeedback] = await db.insert(feedbacks).values({
      message: feedbackData.feedbackText.slice(0, MAX_FEEDBACK_LENGTH),
      rating: feedbackData.rating,
      source: source[0].id,
      metadata: feedbackData.metadata,
    }).returning();

    const projectWebhooks = await db.query.webhooks.findMany({
      where: (webhooks, { and, eq }) =>
        and(
          eq(webhooks.projectId, source[0].projectId),
          eq(webhooks.isActive, true)
        ),
    });

    const relevantWebhooks = projectWebhooks.filter(wh =>
      wh.sources && wh.sources.includes(source[0].id)
    );

    // Dispatch to each webhook
    for (const webhook of relevantWebhooks) {
      // Create delivery record
      const [delivery] = await db.insert(webhookDeliveries).values({
        webhookId: webhook.id,
        feedbackId: insertedFeedback.id,
        status: "pending",
      }).returning();

      (async () => {
        try {
          const payload = {
            id: insertedFeedback.id,
            event: "feedback.created",
            timestamp: new Date().toISOString(),
            data: {
              rating: insertedFeedback.rating,
              message: insertedFeedback.message,
              metadata: insertedFeedback.metadata,
              source: {
                id: source[0].id,
                name: source[0].name
              }
            }
          };

          const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // TODO: Add Signature header using webhook.secret
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          // Update delivery status
          await db.update(webhookDeliveries)
            .set({
              status: "success",
              response: { status: response.status, statusText: response.statusText }
            })
            .where(eq(webhookDeliveries.id, delivery.id));

        } catch (error: any) {
          console.error(`Webhook ${webhook.id} failed:`, error);
          await db.update(webhookDeliveries)
            .set({
              status: "failed",
              response: { error: error.message }
            })
            .where(eq(webhookDeliveries.id, delivery.id));
        }
      })();
    }

    return c.json({ message: "Feedback received" }, 201);
  }
  );
