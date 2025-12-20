import { Hono } from 'hono';
export const feedbackRoute = new Hono().post('/', (c) => {
    return c.json({ message: 'Feedback received' });
});
