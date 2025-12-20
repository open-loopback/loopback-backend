import { Hono } from 'hono'
import { feedbackRoute } from './routes/feedback.js'
import { healthRoute } from './routes/health.js'

const app = new Hono()

app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

app.onError((err, c) => {
  console.error('App Error:', err)
  return c.json({ error: err.message, stack: err.stack }, 500)
})


const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})


app.get('/sources', async (c) => {
  return c.json({ message: "Sources route is accessible via GET" }, 200)
})
app.route('/feedback', feedbackRoute)

app.route('/health',healthRoute)

export default app
