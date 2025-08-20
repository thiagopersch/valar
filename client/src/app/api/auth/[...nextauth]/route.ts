import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface UserWithToken extends User {
  id: string;
  password: string;
  token: string;
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const BASE_URL = process.env.API_URL?.replace('/api', '');
        const API_URL = process.env.API_URL;
        try {
          console.log('Fetching CSRF from:', `${BASE_URL}/sanctum/csrf-cookie`);
          await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
          });

          console.log('Posting to:', `${API_URL}/auth/login`);
          const response = await axios.post(
            `${API_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            { withCredentials: true },
          );
          if (response.status === 200 || response.status === 201) {
            const { user, token, churches } = response.data;
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              password: user.password ?? '',
              change_password: user.change_password ?? false,
              status: user.status ?? false,
              token,
              churches,
            };
          }
          return null;
        } catch (error) {
          console.log('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserWithToken;
      session.token = token.token;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
