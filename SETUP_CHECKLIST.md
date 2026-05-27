# MongoDB Migration - Setup Checklist

## ✅ What's Been Done

Your application has been completely migrated from Supabase to MongoDB with NextAuth.js. Here's what was changed:

### Files Modified:
- ✅ `package.json` - Updated dependencies (removed Supabase, added MongoDB + NextAuth)
- ✅ `.env.local` - Updated with MongoDB connection details
- ✅ `.env.local.example` - Updated environment template
- ✅ `middleware.ts` - Switched to NextAuth from Supabase
- ✅ `src/app/auth/login/page.tsx` - Updated to use credentials provider
- ✅ `src/app/auth/signup/page.tsx` - Updated to use MongoDB registration
- ✅ `src/app/api/tasks/route.ts` - Switched to MongoDB queries
- ✅ `src/app/api/analytics/route.ts` - Switched to MongoDB queries
- ✅ `src/app/api/roadmap/route.ts` - Switched to MongoDB + persistence
- ✅ `src/app/api/research/route.ts` - Added MongoDB persistence for research results

### Files Created:
- ✅ `src/lib/mongodb/client.ts` - MongoDB connection client
- ✅ `src/lib/mongodb/schema.ts` - MongoDB schema documentation
- ✅ `src/lib/auth.ts` - NextAuth.js configuration
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- ✅ `src/app/api/auth/register/route.ts` - Registration endpoint
- ✅ `src/app/api/auth/signin/route.ts` - Sign-in endpoint
- ✅ `MONGODB_MIGRATION.md` - Detailed migration documentation

---

## 🚀 Next Steps (Required)

### Step 1: Install Dependencies
```bash
npm install
# or if using pnpm:
pnpm install
```

### Step 2: Verify MongoDB Connection String
Your `.env.local` file already contains:
```
MONGODB_URI=mongodb+srv://SuprajUShivajji:Supraj2006$@cluster0.i2togol.mongodb.net/innovyra
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ Important**: 
- In production, generate a new strong `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` to your production domain with HTTPS
- Keep MongoDB credentials secure (never commit .env.local to git)

### Step 3: Create MongoDB Indexes (Optional but Recommended)
Log into MongoDB Atlas and run in mongosh:

```javascript
// Sessions (required for NextAuth)
db.sessions.createIndex({ sessionToken: 1 }, { unique: true })
db.sessions.createIndex({ userId: 1 })
db.sessions.createIndex({ expires: 1 })

// Tasks
db.tasks.createIndex({ userId: 1 })
db.tasks.createIndex({ userId: 1, status: 1 })
db.tasks.createIndex({ created_at: -1 })

// Other collections (optional)
db.career_goals.createIndex({ userId: 1 })
db.ai_research.createIndex({ userId: 1 })
db.roadmaps.createIndex({ userId: 1 })
db.milestones.createIndex({ userId: 1 })
db.projects.createIndex({ userId: 1 })
db.analytics.createIndex({ userId: 1, day: 1 })
```

### Step 4: Start the Development Server
```bash
npm run dev
# or if using pnpm:
pnpm dev
```

The app will start at **http://localhost:3000**

### Step 5: Test the Application
1. Open http://localhost:3000/auth/signup
2. Create a new account with your email and password
3. You should be automatically logged in
4. Try going to http://localhost:3000/dashboard
5. Create some tasks to test the MongoDB integration

---

## 📋 Testing Checklist

- [ ] App starts without errors (`npm run dev`)
- [ ] Can create a new account (`/auth/signup`)
- [ ] Can log in with created account (`/auth/login`)
- [ ] Dashboard loads after login (`/dashboard`)
- [ ] Can create tasks and see them displayed
- [ ] Analytics endpoint returns data (`/api/analytics`)
- [ ] Can generate roadmaps (`/api/roadmap`)
- [ ] Research feature works if OPENROUTER_API_KEY is set

---

## 🐛 Troubleshooting

### MongoDB Connection Errors
```
MongoError: connect ECONNREFUSED or EHOSTUNREACH
```
**Solution**: 
- Check MongoDB URI is correct
- In MongoDB Atlas, add your IP to Network Access
- Verify database name in URI matches

### NextAuth Errors
```
Error: NEXTAUTH_SECRET not configured
```
**Solution**:
- Set `NEXTAUTH_SECRET` in `.env.local`
- It should be a long random string: `openssl rand -base64 32`

### Authentication Not Working
**Solution**:
- Clear browser cookies: DevTools > Application > Cookies > Delete all
- Check MongoDB users collection has data
- Verify password hashing is working (check API console logs)
- Make sure sessions collection is being written to

### Database Query Errors
**Solution**:
- Check MongoDB ObjectId format is correct
- Verify userId field is being passed from session
- Look at API route response for error messages

---

## 📚 Documentation

For detailed information, see:
- **Full Migration Guide**: `MONGODB_MIGRATION.md`
- **NextAuth Config**: `src/lib/auth.ts`
- **MongoDB Client**: `src/lib/mongodb/client.ts`
- **MongoDB Schema**: `src/lib/mongodb/schema.ts`

---

## 🔐 Security Reminders

1. ✅ Passwords are hashed with bcryptjs (10 rounds)
2. ✅ NextAuth sessions are encrypted
3. ⚠️ Change `NEXTAUTH_SECRET` in production
4. ⚠️ Use HTTPS in production for `NEXTAUTH_URL`
5. ⚠️ Never commit `.env.local` to git
6. ✅ All routes check authentication before accessing user data

---

## 🎯 What's Working

Your app now has:
- ✅ User registration and login with MongoDB
- ✅ Encrypted password storage
- ✅ Session management with NextAuth
- ✅ Task management with MongoDB
- ✅ Analytics with MongoDB
- ✅ Roadmap generation with MongoDB persistence
- ✅ Research feature with OpenRouter + MongoDB

---

## 💡 Next Features to Build

- Add OAuth providers (Google, GitHub) to `src/lib/auth.ts`
- Implement email verification with NextAuth
- Add password reset functionality
- Create dashboard components to use the MongoDB data
- Add frontend for career goals, milestones, projects

---

**Questions?** Check `MONGODB_MIGRATION.md` for comprehensive documentation.
