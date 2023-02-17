import { IncomingMessage } from "http";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import authOptions from "../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  return await unstable_getServerSession(
    ctx.req as IncomingMessage & { cookies: { [key: string]: string } },
    ctx.res,
    authOptions
  );
};
