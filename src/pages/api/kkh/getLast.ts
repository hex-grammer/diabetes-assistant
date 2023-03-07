import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import type { kkh } from "@prisma/client";

type Data = {
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | kkh[]>
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    const { dataLength } = req.query;
    try {
      const latestKkhs = await prisma.kkh.findMany({
        orderBy: { created_at: "desc" },
        where: {
          email: session?.user?.email || "",
        },
        take: Number(dataLength),
      });

      res.status(200).json(latestKkhs);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
