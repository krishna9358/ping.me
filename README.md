# Ping.Me - Website Uptime Monitoring Service
A modern, real-time website monitoring service that helps you track your website's uptime, response times, and performance metrics.

## 🚀 Features

- Real-time website monitoring
- Multi-region status checks
- Instant notifications
- Performance metrics
- User authentication & authorization
- RESTful API

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (v1.0.x)
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React with TypeScript
- **Real-time**: RedisSteam (Pusher)
- **Testing**: Bun Test
- **Containerization**: Docker (optional)

## 📁 Project Structure

```
better-uptime/
├── apps/
│   ├── api/                 # Backend API service
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── index.ts         # API entry point
│   │
│   ├── frontend/            # React frontend
│   │   ├── src/
│   │   │   ├── pages/       # React pages
│   │   │   └── components/  # Reusable components
│   │
│   └── tests/               # Integration/end-to-end tests
│
├── packages/
│   ├── store/               # Shared database layer
│   │   ├── prisma/         # Prisma schema and migrations
│   │   └── index.ts        # Database client exports
│   │
│   ├── ui/                  # Shared UI components
│   └── eslint-config/       # Shared ESLint configs
│
├── .github/                 # GitHub workflows and templates
├── .env.example            # Environment variables template
└── package.json            # Root package.json with workspace config
```

## 🚀 Getting Started

### Prerequisites

- Bun v1.0.x
- Node.js v18+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/better-uptime.git
   cd better-uptime
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. **Database setup**
   ```bash
   # Run database migrations
   cd packages/store
   bun prisma migrate dev
   ```

5. **Start the development servers**
   ```bash
   # In the root directory
   bun dev
   ```

## 🔧 Environment Variables

### API (.env in root)
```
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/better_uptime?schema=public"

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Pusher (for real-time updates)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```

## 🧪 Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test apps/tests/website.test.ts
```

## 🛠 Development

### Code Style
- We use ESLint and Prettier for code formatting
- Run `bun lint` to check for linting errors
- Run `bun format` to format your code


<div align="center">
  Made with ❤️ by [Your Name]
</div>