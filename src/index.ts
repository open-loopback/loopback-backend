import { Hono } from 'hono'
import { feedbackRoute } from './routes/feedback.js'

const app = new Hono()

app.route('/feedback', feedbackRoute)

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
