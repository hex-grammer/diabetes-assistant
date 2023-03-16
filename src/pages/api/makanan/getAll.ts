import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const result = await prisma.aturan.findMany({
        orderBy: {
          id: "desc",
        },
      });

      const aturan = result.map((item) => ({
        id: item.id,
        makanan: item.makanan,
        kategori: item.kategori.split(",").map((value) => value === "true"),
      }));

      res.status(200).json(aturan);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid HTTP method" });
  }
}
