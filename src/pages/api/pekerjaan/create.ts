import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

interface PekerjaanRequestBody {
  id: number;
  nama_pekerjaan: string;
  aktivitas: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const requestBody = req.body as PekerjaanRequestBody[];
      console.log(requestBody);
      const result = await Promise.all(
        requestBody.map(async (data) => {
          const existingData = await prisma.pekerjaan.findUnique({
            where: {
              id: data.id,
            },
          });

          if (existingData) {
            if (existingData.aktivitas !== data.aktivitas) {
              return await prisma.pekerjaan.update({
                where: {
                  id: data.id,
                },
                data: {
                  nama_pekerjaan: data.nama_pekerjaan,
                  aktivitas: data.aktivitas,
                },
              });
            } else {
              return existingData;
            }
          } else {
            return await prisma.pekerjaan.create({
              data: {
                id: data.id,
                nama_pekerjaan: data.nama_pekerjaan,
                aktivitas: data.aktivitas,
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
