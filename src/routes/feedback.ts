import { Hono } from 'hono';

export const feedbackRoute = new Hono()
  .get('/', (c) => {
    return c.json({ message: 'Feedback route is working!' })
  })
  .post('/', (c) => {
  return c.json({ message: 'Feedback received' });
});