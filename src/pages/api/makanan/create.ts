import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

interface AturanRequestBody {
  id: number;
  makanan: string;
  kategori: boolean[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const requestBody = req.body as AturanRequestBody[];
      const result = await Promise.all(
        requestBody.map(async (data) => {
          const existingData = await prisma.aturan.findUnique({
            where: {
              id: data.id,
            },
          });

          if (existingData) {
            if (existingData.makanan !== data.makanan) {
              return await prisma.aturan.update({
                where: {
                  id: data.id,
                },
                data: {
                  makanan: data.makanan,
                },
              });
            } else {
              return existingData;
            }
          } else {
            return await prisma.aturan.create({
              data: {
                id: data.id,
                makanan: data.makanan,
                kategori: data.kategori.join(","),
              },
            });
          }
        })
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Invalid HTTP method" });
  }
}
