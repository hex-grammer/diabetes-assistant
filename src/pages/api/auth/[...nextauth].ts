import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/db";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: `${String(process.env.GOOGLE_ID)}`,
      clientSecret: `${String(process.env.GOOGLE_SECRET)}`,
    }),
    // ...add more providers here
  ],
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session({ session, user, token }) {
      // session.user = user;
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
