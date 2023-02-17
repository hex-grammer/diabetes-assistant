import { getSession, GetSessionOptions } from "next-auth/client";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { IncomingMessage, ServerResponse } from "http";

export const getServerAuthSession = async (ctx: {
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> };
  res: ServerResponse<IncomingMessage>;
}) => {
  return await getSession({
    req: ctx.req,
    res: ctx.res,
    options: authOptions,
  } as GetSessionOptions);
};
