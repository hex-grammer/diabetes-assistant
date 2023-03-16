import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const id = parseInt(req.query.id as string);
      if (!id) {
        res.status(400).json({ message: "Invalid request, ID not found" });
        return;
      }

      const result = await prisma.aturan.delete({
        where: { id },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Invalid HTTP method" });
  }
}
