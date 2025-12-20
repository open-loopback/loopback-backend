import { Hono } from "hono";
export const healthRoute = new Hono().get("/", async (c) => {
    return c.json({ message: "OK" }, 200);
});
