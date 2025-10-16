import type { PrismaClient } from "@prisma/client";
import type { CreateUser, UpdateUser } from "../schemas/user.schema";

export const userService = (prisma: PrismaClient) => ({
  getAll: async () => {
    return prisma.user.findMany({
      include: { posts: true },
    });
  },
  getById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  },
  create: async (data: CreateUser) => {
    return prisma.user.create({ data });
  },
  update: async (id: string, data: UpdateUser) => {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;
    return prisma.user.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;
    await prisma.user.delete({ where: { id } });
    return true;
  },
});
