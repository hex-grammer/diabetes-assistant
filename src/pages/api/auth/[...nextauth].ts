import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
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
    signIn() {
      return true;
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session({ session }) {
      return session;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.uid = user.id;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        token.name = session;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
