import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user in the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password, // You should hash the password before storing it
        },
      });

      return res.status(200).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}
