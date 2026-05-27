# INNOVYRA — Smart Career Execution Engine

"From Career Goal → Real Execution → Measurable Growth."

This repo is a hackathon-ready MVP scaffold:
- Next.js (App Router) + Tailwind
- NextAuth.js + MongoDB (email/password authentication) + protected dashboard
- Project HUB dashboard skeleton (Kanban + analytics + AI insights panel)
- API routes: `/api/research`, `/api/tasks`, `/api/roadmap`, `/api/analytics`
- MongoDB collections for data persistence

## 1) Install

This project uses **pnpm**:

```bash
pnpm install
```

If pnpm blocks native builds on your machine, run:

```bash
pnpm approve-builds --all
pnpm install
```

## 2) MongoDB Setup

1. Create a MongoDB cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with credentials
3. Get your MongoDB connection string

**For detailed setup instructions, see [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**

## 3) Environment Variables

Create `.env.local` (copy from `.env.local.example`) and fill:

- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - A random secret (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)

Optional (for live research via OpenRouter):
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (default: `deepseek/deepseek-v4-flash:free`)

## 4) Run

```bash
pnpm dev
```

Open http://localhost:3000

## 5) Demo Flow

1. **Sign Up** - Create account at `/auth/signup`
2. **Auto-Login** - Redirected to `/dashboard`
3. **Create Tasks** - Add tasks in Kanban board
4. **View Analytics** - See task completion metrics
5. **Generate Roadmaps** - Create career roadmaps
6. **AI Research** - Run research (with OpenRouter API key)

---

## Documentation

- **Quick Start**: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
- **Full Migration Guide**: [MONGODB_MIGRATION.md](./MONGODB_MIGRATION.md)
- **MongoDB Schema**: [src/lib/mongodb/schema.ts](./src/lib/mongodb/schema.ts)
- **Auth Configuration**: [src/lib/auth.ts](./src/lib/auth.ts)

---

## Key Features

✅ User authentication with MongoDB + bcryptjs  
✅ NextAuth.js session management  
✅ Task management (CRUD operations)  
✅ Analytics dashboard  
✅ Roadmap generation  
✅ AI-powered research with OpenRouter  
✅ Kanban board interface  
✅ Protected routes and API endpoints  

---

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Auth**: NextAuth.js 5 with MongoDB adapter
- **Database**: MongoDB (Atlas recommended)
- **API**: Next.js API Routes with Zod validation
- **AI**: OpenRouter (DeepSeek v4 Flash) (optional)
- **Password Hashing**: bcryptjs

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/    # NextAuth handler
│   │       ├── register/         # Registration API
│   │       └── signin/           # Sign-in API
│   ├── auth/
│   │   ├── login/                # Login page
│   │   └── signup/               # Signup page
│   └── dashboard/                # Main app
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   └── mongodb/
│       ├── client.ts             # MongoDB connection
│       └── schema.ts             # Collections schema
└── components/
    └── ui/                       # UI components
```

---

## Getting Started Quickly

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# 3. Run development server
pnpm dev

# 4. Create account at http://localhost:3000/auth/signup
```

For complete setup guide, see [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
