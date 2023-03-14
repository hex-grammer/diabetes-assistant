import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { name, username, password } = req.body as {
    name: string;
    username: string;
    password: string;
  };

  // cek apakah username sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  // create newPassword by encrypt password using crypto
  function encryptPassword(): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return [salt, hash].join("$");
  }

  if (existingUser) {
    res.status(409).json({ message: "Username already exists" });
    return;
  }

  try {
    // buat user baru
    const newUser = await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: encryptPassword(),
      },
    });

    res.status(201).json({ message: "User created", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  } finally {
    await prisma.$disconnect();
  }
}
