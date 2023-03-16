import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

interface AturanRequestBody {
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
              makanan: data.makanan,
            },
          });

          if (existingData) {
            if (existingData.kategori !== data.kategori.join(",")) {
              return await prisma.aturan.update({
                where: {
                  id: existingData.id,
                },
                data: {
                  kategori: data.kategori.join(","),
                },
              });
            } else {
              return existingData;
            }
          } else {
            return await prisma.aturan.create({
              data: {
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
