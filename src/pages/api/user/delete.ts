import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email, username } = req.query;
  console.log(req.query);

  try {
    if (email) {
      await prisma.user.delete({ where: { email: String(email) } });
    } else if (username) {
      await prisma.user.delete({ where: { username: String(username) } });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
