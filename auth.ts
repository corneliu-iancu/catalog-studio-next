import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// This will be temporary for PoC - in production, use a proper database
// Password is "password123" hashed with bcrypt
const users = [
  {
    id: "1",
    name: "Restaurant Admin", 
    email: "admin@restaurant.com",
    password: "$2b$10$dzxivuIvJLL82mBYBoenFe9ZuxSY039Tyj1Qg4sEple5x/8ROoNlK", // password123
    role: "admin"
  }
]

export const config: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 Authorize called with:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null
        }

        const user = users.find(user => user.email === credentials.email)
        console.log("👤 User found:", user ? "Yes" : "No");
        
        if (!user) {
          console.log("❌ User not found");
          return null
        }

        console.log("🔑 Comparing password...");
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        
        console.log("✅ Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("❌ Invalid password");
          return null
        }

        console.log("🎉 Authentication successful");
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
