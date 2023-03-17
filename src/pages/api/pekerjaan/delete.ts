import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const nama_pekerjaan = req.query.nama_pekerjaan as string;
      if (!nama_pekerjaan) {
        res.status(400).json({ message: "Invalid request, ID not found" });
        return;
      }

      const result = await prisma.pekerjaan.delete({
        where: { nama_pekerjaan },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Invalid HTTP method" });
  }
}
