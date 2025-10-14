import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { successResponse, errorResponse } from "../utils/response";

export async function postRoutes(app: FastifyInstance) {
  // GET all posts
  app.withTypeProvider<ZodTypeProvider>().get(
    "/posts",
    {
      schema: { summary: "List all posts", tags: ["Posts"] },
    },
    async (_, reply) => {
      const posts = await app.prisma.post.findMany({
        include: { author: true },
      });
      return reply.send(successResponse(posts));
    }
  );

  // POST create post
  app.withTypeProvider<ZodTypeProvider>().post(
    "/posts",
    {
      schema: {
        summary: "Create a new post",
        tags: ["Posts"],
        body: z.object({
          title: z.string().min(2),
          content: z.string(),
          authorId: z.uuid().optional(),
        }),
      },
    },
    async (req, reply) => {
      const { title, content, authorId } = req.body;

      // Optional: check if author exists
      if (authorId) {
        const authorExists = await app.prisma.user.findUnique({
          where: { id: authorId },
        });
        if (!authorExists) {
          return reply.code(404).send(errorResponse("Author not found", 404));
        }
      }

      const post = await app.prisma.post.create({
        data: { title, content, authorId },
      });

      return reply.code(201).send(successResponse(post, 201));
    }
  );

  // GET post by id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/posts/:id",
    {
      schema: {
        summary: "Get post by id",
        tags: ["Posts"],
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;

      const post = await app.prisma.post.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!post) {
        return reply.code(404).send(errorResponse("Post not found", 404));
      }

      return reply.send(successResponse(post));
    }
  );

  // PUT update post
  app.withTypeProvider<ZodTypeProvider>().put(
    "/posts/:id",
    {
      schema: {
        summary: "Update post",
        tags: ["Posts"],
        params: z.object({ id: z.uuid() }),
        body: z.object({
          title: z.string().min(2).optional(),
          content: z.string().optional(),
          authorId: z.uuid().optional(),
        }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const { title, content, authorId } = req.body;

      const existingPost = await app.prisma.post.findUnique({ where: { id } });
      if (!existingPost) {
        return reply.code(404).send(errorResponse("Post not found", 404));
      }

      if (authorId) {
        const authorExists = await app.prisma.user.findUnique({
          where: { id: authorId },
        });
        if (!authorExists) {
          return reply.code(404).send(errorResponse("Author not found", 404));
        }
      }

      const updatedPost = await app.prisma.post.update({
        where: { id },
        data: { title, content, authorId },
      });

      return reply.send(successResponse(updatedPost));
    }
  );

  // DELETE post
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/posts/:id",
    {
      schema: {
        summary: "Delete post",
        tags: ["Posts"],
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;

      const existingPost = await app.prisma.post.findUnique({ where: { id } });
      if (!existingPost) {
        return reply.code(404).send(errorResponse("Post not found", 404));
      }

      await app.prisma.post.delete({ where: { id } });
      return reply.send(successResponse("Post deleted successfully"));
    }
  );
}
