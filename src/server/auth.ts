import { IncomingMessage } from "http";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import authOptions from "../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  const req = ctx.req as IncomingMessage & {
    cookies: { [key: string]: string };
  };
  const res = ctx.res;
  const session = await unstable_getServerSession(req, res, authOptions as any);
  return session;
};
