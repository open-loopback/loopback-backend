import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import { string, object, number, record, any } from "zod";
import { eq } from "drizzle-orm";
import { feedbacks, sources } from "../db/schema.js";
import { db } from "../db/index.js";
const schema = object({
    sourceId: string().min(1),
    feedbackText: string().min(1).max(1000),
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
    await db.insert(feedbacks).values({
        message: feedbackData.feedbackText,
        rating: feedbackData.rating,
        source: source[0].id,
        metadata: feedbackData.metadata,
    });
    return c.json({ message: "Feedback received" }, 201);
});
