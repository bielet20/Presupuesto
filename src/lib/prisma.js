import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "path";

const globalForPrisma = global;

const getPrisma = () => {
  const dbPath = path.resolve(process.cwd(), "dev.db");
  const url = `file:${dbPath}`;
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || getPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
