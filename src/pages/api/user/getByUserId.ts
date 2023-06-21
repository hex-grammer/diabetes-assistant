import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function getUserById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email, username } = req.query as {
    email?: string;
    username?: string;
  };
  console.log(req.query);

  if (!email && !username) {
    res.status(400).json({ message: "Email or username is required" });
    return;
  }

  try {
    let userQuery;

    if (email) {
      userQuery = prisma.user.findUnique({ where: { email: String(email) } });
    } else if (username) {
      userQuery = prisma.user.findUnique({
        where: { username: String(username) },
      });
    }

    const user = await userQuery;

    if (!user) {
      res.status(404).json({ message: `User not found!` });
    } else {
      res.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
