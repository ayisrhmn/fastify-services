import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { postService } from "../services/post.service";
import { errorResponse, successResponse } from "../shared/utils/response";
import type { CreatePost, UpdatePost } from "../schemas/post.schema";

export const postController = (app: FastifyInstance) => {
  const service = postService(app.prisma);

  return {
    getAll: async (_: FastifyRequest, reply: FastifyReply) => {
      const posts = await service.getAll();
      return reply.send(successResponse(posts));
    },
    getById: async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const post = await service.getById(id);
      if (!post) {
        return reply.code(404).send(errorResponse("Post not found", 404));
      }
      return reply.send(successResponse(post));
    },
    create: async (
      req: FastifyRequest<{ Body: CreatePost }>,
      reply: FastifyReply
    ) => {
      const post = await service.create(req.body);
      return reply.code(201).send(successResponse(post, 201));
    },

    update: async (
      req: FastifyRequest<{ Params: { id: string }; Body: UpdatePost }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const post = await service.update(id, req.body);
      if (!post)
        return reply.code(404).send(errorResponse("Post not found", 404));
      return reply.send(successResponse(post));
    },

    delete: async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const deleted = await service.delete(id);
      if (!deleted)
        return reply.code(404).send(errorResponse("Post not found", 404));
      return reply.send(successResponse("Post successfully deleted"));
    },
  };
};
