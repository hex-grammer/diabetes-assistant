import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

type KkhData = {
  id_kkh?: number;
  berat_badan: number;
  tinggi_badan: number;
  umur: number;
  pekerjaan: string;
  aktivitas: string;
  jenis_kelamin: string;
  email?: string;
  username?: string;
  kkh: number;
  imt: number;
  created_at?: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const kkhData: KkhData = req.body as KkhData;
    // remove the id from the data
    const { id_kkh, created_at, ...otherData } = kkhData;
    try {
      const newKkh = (await prisma.kkh.create({ data: otherData })) as KkhData;
      res.status(201).json(newKkh);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error saving data", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
