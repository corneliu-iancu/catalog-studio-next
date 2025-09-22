import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Replace with actual authentication logic
        // This is just a placeholder for development
        if (credentials?.email && credentials?.password) {
          // In a real app, you would:
          // 1. Hash the password
          // 2. Query your database
          // 3. Verify the credentials
          
          // Mock user for development
          if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
            return {
              id: '1',
              email: 'demo@example.com',
              name: 'Demo Restaurant',
              restaurantId: '1',
              restaurantSlug: 'demo-restaurant'
            };
          }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.restaurantId = user.restaurantId;
        token.restaurantSlug = user.restaurantSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.restaurantId = token.restaurantId as string;
        session.user.restaurantSlug = token.restaurantSlug as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
