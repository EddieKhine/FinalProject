// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/db'; // Import your database connection file
import User from '../../../models/User'; // Import your User model
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

export default NextAuth({
  providers: [
    // Use the CredentialsProvider directly from next-auth/providers/credentials
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const { username, password } = credentials;
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error('Invalid username or password');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid username or password');
        }

        // If successful, return the user object
        return { id: user._id, username: user.username, email: user.email };
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect to custom login page
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
});
