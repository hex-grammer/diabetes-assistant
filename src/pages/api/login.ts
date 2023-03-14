import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    // cari user berdasarkan username
    const user = await prisma.user.findUnique({ where: { username } });

    // jika user tidak ditemukan, kirim error response
    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // cek apakah password cocok dengan hash di database
    function verifyPassword(password: string, hashedPassword: string): boolean {
      const [salt, hash] = hashedPassword.split("$");

      if (!salt) {
        // handle the case where `salt` is undefined
        return false;
      }

      const verifyHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      return hash === verifyHash;
    }

    if (!verifyPassword(password, user.password || "")) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // jika login berhasil, kirim response dengan status 200
    return res.status(200).json({ message: "Login berhasil", user });
  } else {
    // jika method selain POST dipanggil, kirim error response
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }
}
