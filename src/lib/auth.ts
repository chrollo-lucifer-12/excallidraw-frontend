import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: {
    provider: "prisma",
    prisma,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },
});
