import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { errorResponse, successResponse } from "../utils/response";

export async function userRoutes(app: FastifyInstance) {
  // GET all users
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/users",
      { schema: { summary: "List all users", tags: ["Users"] } },
      async (_, reply) => {
        const users = await app.prisma.user.findMany({
          include: { posts: true },
        });
        return reply.send(successResponse(users));
      }
    );

  // POST create user
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        summary: "Create user",
        tags: ["Users"],
        body: z.object({ name: z.string().min(2), email: z.email() }),
      },
    },
    async (req, reply) => {
      const { name, email } = req.body;
      const user = await app.prisma.user.create({ data: { name, email } });
      return reply.code(201).send(successResponse(user, 201));
    }
  );

  // GET user by id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:id",
    {
      schema: {
        summary: "Get user by id",
        tags: ["Users"],
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const user = await app.prisma.user.findUnique({
        where: { id },
        include: { posts: true },
      });
      if (!user) {
        return reply.code(404).send(errorResponse("User not found", 404));
      }
      return successResponse(user);
    }
  );

  // PUT update user
  app.withTypeProvider<ZodTypeProvider>().put(
    "/users/:id",
    {
      schema: {
        summary: "Update user",
        tags: ["Users"],
        params: z.object({ id: z.uuid() }),
        body: z.object({
          name: z.string().min(2).optional(),
          email: z.email().optional(),
        }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const { name, email } = req.body;

      const existingUser = await app.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.code(404).send(errorResponse("User not found", 404));
      }

      const updatedUser = await app.prisma.user.update({
        where: { id },
        data: { name, email },
      });

      return reply.send(successResponse(updatedUser));
    }
  );

  // DELETE user
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/users/:id",
    {
      schema: {
        summary: "Delete user",
        tags: ["Users"],
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;

      const existingUser = await app.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.code(404).send(errorResponse("User not found", 404));
      }

      await app.prisma.user.delete({
        where: { id },
      });

      return reply.send(successResponse("User successfully deleted"));
    }
  );
}
