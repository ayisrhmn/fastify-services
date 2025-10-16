import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/user.service";
import { errorResponse, successResponse } from "../shared/utils/response";
import type { CreateUser, UpdateUser } from "../schemas/user.schema";

export const userController = (app: FastifyInstance) => {
  const service = userService(app.prisma);

  return {
    getAll: async (_: FastifyRequest, reply: FastifyReply) => {
      const users = await service.getAll();
      return reply.send(successResponse(users));
    },

    getById: async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const user = await service.getById(id);
      if (!user) {
        return reply.code(404).send(errorResponse("User not found", 404));
      }
      return reply.send(successResponse(user));
    },

    create: async (
      req: FastifyRequest<{ Body: CreateUser }>,
      reply: FastifyReply
    ) => {
      const user = await service.create(req.body);
      return reply.code(201).send(successResponse(user, 201));
    },

    update: async (
      req: FastifyRequest<{ Params: { id: string }; Body: UpdateUser }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const user = await service.update(id, req.body);
      if (!user)
        return reply.code(404).send(errorResponse("User not found", 404));
      return reply.send(successResponse(user));
    },

    delete: async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const deleted = await service.delete(id);
      if (!deleted)
        return reply.code(404).send(errorResponse("User not found", 404));
      return reply.send(successResponse("User successfully deleted"));
    },
  };
};
