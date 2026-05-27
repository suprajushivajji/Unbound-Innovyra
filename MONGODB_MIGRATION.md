# MongoDB Migration Guide

This document outlines the complete migration from Supabase to MongoDB with NextAuth.js authentication.

## Changes Made

### 1. **Dependencies Updated**
- **Removed**: `@supabase/ssr`, `@supabase/supabase-js`
- **Added**:
  - `mongodb`: MongoDB driver
  - `next-auth`: Authentication framework
  - `@auth/mongodb-adapter`: MongoDB adapter for NextAuth
  - `bcryptjs`: Password hashing

### 2. **Environment Variables**
Old Supabase variables have been replaced:
```
# OLD (Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# NEW (MongoDB + NextAuth)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innovyra
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. **File Structure Changes**

#### Removed
- `src/lib/supabase/client.ts` → Replaced by `src/lib/mongodb/client.ts`
- `src/lib/supabase/server.ts` → Replaced by `src/lib/auth.ts`

#### Added
- `src/lib/mongodb/client.ts` - MongoDB connection client
- `src/lib/mongodb/schema.ts` - MongoDB collections schema documentation
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/api/auth/register/route.ts` - User registration endpoint
- `src/app/api/auth/signin/route.ts` - User sign-in endpoint

#### Updated
- `middleware.ts` - Now uses NextAuth instead of Supabase
- `src/app/auth/login/page.tsx` - Uses custom credentials provider
- `src/app/auth/signup/page.tsx` - Uses custom registration API
- `src/app/api/tasks/route.ts` - Uses MongoDB instead of Supabase
- `src/app/api/analytics/route.ts` - Uses MongoDB instead of Supabase
- `src/app/api/roadmap/route.ts` - Uses MongoDB instead of Supabase
- `src/app/api/research/route.ts` - Added MongoDB persistence for research results

### 4. **Database Collections**

MongoDB collections created (auto-managed by NextAuth for users/sessions):

**User Managed Collections:**
- `career_goals` - Career goal information
- `ai_research` - AI research results from OpenRouter
- `roadmaps` - Roadmaps for career goals
- `tasks` - User tasks with various statuses
- `milestones` - Career milestones
- `projects` - Project portfolio
- `analytics` - Daily analytics snapshots

**NextAuth Managed Collections:**
- `users` - User accounts with hashed passwords
- `sessions` - User sessions
- `accounts` - OAuth accounts (if added)
- `verificationTokens` - Email verification tokens

### 5. **Authentication Flow**

#### Registration (Sign Up)
1. User submits email + password via signup form
2. Request sent to `/api/auth/register`
3. Password hashed with bcryptjs (10 rounds)
4. User created in MongoDB
5. Auto-login after successful signup

#### Login (Sign In)
1. User submits email + password via login form
2. Request sent to `/api/auth/signin`
3. Email looked up in MongoDB users collection
4. Password compared with bcrypt
5. Session created and stored in MongoDB
6. User redirected to dashboard

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 2: Create MongoDB Indexes
Connect to MongoDB using mongosh and run:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: 1 })

// Sessions collection
db.sessions.createIndex({ sessionToken: 1 }, { unique: true })
db.sessions.createIndex({ userId: 1 })
db.sessions.createIndex({ expires: 1 })

// Other collections
db.tasks.createIndex({ userId: 1 })
db.tasks.createIndex({ userId: 1, status: 1 })
db.tasks.createIndex({ created_at: -1 })

db.career_goals.createIndex({ userId: 1 })
db.career_goals.createIndex({ created_at: -1 })

db.ai_research.createIndex({ userId: 1 })
db.ai_research.createIndex({ created_at: -1 })

db.roadmaps.createIndex({ userId: 1 })
db.roadmaps.createIndex({ created_at: -1 })

db.milestones.createIndex({ userId: 1 })
db.milestones.createIndex({ completed: 1 })

db.projects.createIndex({ userId: 1 })
db.projects.createIndex({ status: 1 })

db.analytics.createIndex({ userId: 1, day: 1 })
```

### Step 3: Update Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Update `MONGODB_URI` with your MongoDB connection string
3. Generate a strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
4. Set `NEXTAUTH_URL` to your app URL (localhost:3000 for development)
5. Add OpenRouter API key if you want live research features

### Step 4: Run the Application
```bash
npm run dev
# or
pnpm dev
```

The app will be available at http://localhost:3000

### Step 5: Test Authentication
1. Go to http://localhost:3000/auth/signup
2. Create a new account
3. You should be automatically logged in and redirected to /dashboard
4. Go to http://localhost:3000/auth/login to test login with existing credentials

## Data Migration (If Coming from Supabase)

If you have existing data in Supabase, you'll need to migrate it to MongoDB:

1. Export data from Supabase PostgreSQL tables
2. Transform the schema to match MongoDB collections (see `src/lib/mongodb/schema.ts`)
3. Import into MongoDB using `mongoimport` or similar tools

Example schema transformations:
- PostgreSQL UUIDs → MongoDB ObjectId
- Postgres timestamptz → MongoDB Date
- ENUM types → String in MongoDB
- JSONB → Object in MongoDB

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check network access in MongoDB Atlas (add your IP to whitelist)
- Ensure database name in URI matches your collections

### Authentication Issues
- Clear browser cookies/cache
- Check `NEXTAUTH_SECRET` is set and consistent
- Verify MongoDB sessions collection is being written to
- Check browser console for error messages

### API Route Issues
- Ensure user is authenticated before accessing protected routes
- Check MongoDB user ID format (should be ObjectId)
- Verify collection names are correct (case-sensitive)

## NextAuth Configuration

For more info, see `src/lib/auth.ts`. Currently configured with:
- **Provider**: Credentials (email + password)
- **Adapter**: MongoDB
- **Pages**: Custom login/signup pages
- **Callbacks**: JWT token and session customization

To add OAuth providers (Google, GitHub, etc.), modify `src/lib/auth.ts`:

```typescript
import GoogleProvider from "next-auth/providers/google";

// Add to providers array
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
```

## MongoDB Operations Reference

### User Queries
```typescript
// Find user by email
db.users.findOne({ email: "user@example.com" })

// Get all users
db.users.find({}).toArray()

// Count users
db.users.countDocuments({})
```

### Task Queries
```typescript
// Get user's tasks
db.tasks.find({ userId: ObjectId("...") }).toArray()

// Get completed tasks for user
db.tasks.find({ userId: ObjectId("..."), status: "completed" }).toArray()

// Get incomplete tasks
db.tasks.find({ userId: ObjectId("..."), status: { $ne: "completed" } }).toArray()
```

## Important Security Notes

1. **NEXTAUTH_SECRET**: Generate a strong, random secret. Never commit to git.
2. **MongoDB Credentials**: Keep connection string in `.env.local`, never expose in code
3. **Password Hashing**: Uses bcryptjs with 10 rounds (bcryptjs.hash(..., 10))
4. **HTTPS in Production**: Set `NEXTAUTH_URL` to your production domain with HTTPS
5. **Row-Level Security**: Implement in your API routes to ensure users can only access their own data

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
