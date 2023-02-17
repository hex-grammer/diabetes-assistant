import { unstable_getServerSession } from "next-auth";

import authOptions from "../pages/api/auth/[...nextauth]";
import { IncomingMessage, ServerResponse } from "http";

export const getServerAuthSession = async (ctx: {
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> };
  res: ServerResponse<IncomingMessage>;
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
