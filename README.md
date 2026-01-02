# Open Loopback Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Hono](https://img.shields.io/badge/Hono-%23E36002.svg?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-%23C5F74F.svg?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

The backend for Open Loopback, a feedback collection and management system. Built with [Hono](https://hono.dev/), [Bun](https://bun.sh/), and [Drizzle ORM](https://orm.drizzle.team/).

## Features

- **Feedback Collection**: Single endpoint to receive user feedback with ratings and metadata.
- **Relational Data Model**: Manages projects, sources, and feedbacks.
- **Vercel Ready**: Optimized for deployment on Vercel.
- **Type-safe**: Built with TypeScript and Zod for validation.

## Tech Stack

- **Framework**: [Hono](https://hono.dev/)
- **Runtime**: [Bun](https://bun.sh/)
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Vercel CLI](https://vercel.com/docs/cli) installed globally (`npm install -g vercel`)
- A PostgreSQL database (e.g., Supabase)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy `.env.example` to `.env` and fill in your database URL:
   ```bash
   cp .env.example .env
   ```

### Development

Run the development server with hot reload:

```bash
bun dev
```

The server will be available at `http://localhost:3000`.

### Database Management

Drizzle Kit is used for database migrations:

- **Generate migrations**: `bun run db:generate`
- **Push changes directly**: `bun run db:push`
- **Run migrations**: `bun run db:migrate`
- **Open Drizzle Studio**: `bun run db:studio`

### Deployment

To deploy to Vercel:

```bash
vc deploy
```

For production:

```bash
vc deploy --prod
```

## API Documentation

### Feedback

#### Submit Feedback
- **URL**: `/feedback`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "sourceId": "string",
    "feedbackText": "string",
    "rating": number, // 1-5
    "metadata": { ... } // optional
  }
  ```

### Health
- **URL**: `/health`
- **Method**: `GET`
- **Success Response**: `{"message": "OK"}`

## License

MIT
