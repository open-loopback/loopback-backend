import { Hono } from "hono";
import { cors } from "hono/cors";

import { feedbackRoute } from "./routes/feedback.js";
import { healthRoute } from "./routes/health.js";

const app = new Hono();

app.use("*", cors());

app.use("*", async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});

app.onError((err, c) => {
  console.error("App Error:", err);
  // If it's a database error, it might have more details
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    ...(err as any), // Spread other properties if they exist (common in DB errors)
  };
  return c.json({ error: err.message, details: errorDetails }, 500);
});

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.route("/feedback", feedbackRoute);

app.route("/health", healthRoute);

export default app;
