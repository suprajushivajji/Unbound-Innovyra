import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@domain.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const parsed = signInSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!parsed.success) {
          return null;
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: parsed.data.email }).lean();

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcryptjs.compare(
            parsed.data.password,
            (user as any).password as string
          );

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: (user as any)._id?.toString(),
            email: (user as any).email,
            name: (user as any).name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authConfig);

// Export the handler for both GET and POST
export { handler as GET, handler as POST };

// For server-side auth in pages and layouts
export async function auth() {
  return await getServerSession(authConfig);
}
