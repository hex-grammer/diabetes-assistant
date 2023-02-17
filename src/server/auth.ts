import { IncomingMessage } from "http";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import authOptions from "../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;
  return await unstable_getServerSession(
    req as IncomingMessage & { cookies: { [key: string]: string } },
    res,
    authOptions
  );
};
