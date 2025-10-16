import type { PrismaClient } from "@prisma/client";
import type { CreatePost, UpdatePost } from "../schemas/post.schema";

export const postService = (prisma: PrismaClient) => ({
  getAll: async () => {
    return prisma.post.findMany({
      include: { author: true },
    });
  },
  getById: async (id: string) => {
    return prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  },
  create: async (data: CreatePost) => {
    return prisma.post.create({ data });
  },
  update: async (id: string, data: UpdatePost) => {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return null;
    return prisma.post.update({ where: { id }, data });
  },
  delete: async (id: string) => {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return null;
    await prisma.post.delete({ where: { id } });
    return true;
  },
});
