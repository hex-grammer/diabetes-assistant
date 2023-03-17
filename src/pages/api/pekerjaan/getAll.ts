import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const result = await prisma.pekerjaan.findMany({
        orderBy: {
          id: "desc",
        },
      });

      const pekerjaan = result.map((item) => ({
        nama_pekerjaan: item.nama_pekerjaan,
        aktivitas: item.aktivitas,
      }));

      res.status(200).json(pekerjaan);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid HTTP method" });
  }
}
