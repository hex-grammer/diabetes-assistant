import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/db";
import Credentials from "next-auth/providers/credentials";

type Credentials = {
  username: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  // Configure one or more authentication providers
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials: Credentials) {
    //     const user = await prisma.user.findUnique({
    //       where: {
    //         username: credentials.username,
    //       },
    //     });
    //     if (user) {
    //       // const isValid = await crypto.compare(
    //       //   credentials.password,
    //       //   user.password
    //       // );
    //       // if (isValid) {
    //       return user;
    //       // } else {
    //       //   return null;
    //       // }
    //     } else {
    //       return null;
    //     }
    //   },
    // }),
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
};

export default NextAuth(authOptions);
function CredentialsProvider(arg0: {
  name: string;
  credentials: {
    username: { label: string; type: string; placeholder: string };
    password: { label: string; type: string };
  };
  authorize(credentials: any): Promise<import(".prisma/client").User | null>;
}): import("next-auth/providers").Provider {
  throw new Error("Function not implemented.");
}
