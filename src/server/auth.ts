import { IncomingMessage, ServerResponse } from "http";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import authOptions from "../pages/api/auth/[...nextauth]";

type GetServerSessionArgs = [
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> },
  res: ServerResponse<IncomingMessage>,
  options: any
];

export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  const args: GetServerSessionArgs = [
    ctx.req as IncomingMessage & { cookies: { [key: string]: string } },
    ctx.res,
    authOptions,
  ];
  return await unstable_getServerSession(...args);
};
