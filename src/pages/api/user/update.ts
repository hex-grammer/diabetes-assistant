import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { email, username, ...userData } = req.body as {
    email?: string;
    username?: string;
    name?: string;
  };
  console.log(req.body);

  if (!email && !username) {
    res.status(400).json({ message: "Email or username is required" });
    return;
  }

  try {
    let updateQuery;

    if (email) {
      updateQuery = prisma.user.update({
        where: { email: String(email) },
        data: userData,
      });
    } else if (username) {
      updateQuery = prisma.user.update({
        where: { username: String(username) },
        data: userData,
      });
    }

    const updatedUser = await updateQuery;

    if (!updatedUser) {
      res.status(404).json({ message: `User  not found` });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
