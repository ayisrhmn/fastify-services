import type { FastifyInstance } from "fastify";
import { userController } from "../controllers/user.controller";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdSchema,
} from "../schemas/user.schema";

export const userRoutes = (app: FastifyInstance) => {
  const controller = userController(app);

  // GET all users
  app.get(
    "/users",
    { schema: { summary: "List all users", tags: ["Users"] } },
    controller.getAll
  );

  // GET user by id
  app.get(
    "/users/:id",
    {
      schema: {
        summary: "Get user by id",
        tags: ["Users"],
        params: UserIdSchema,
      },
    },
    controller.getById
  );

  // POST create user
  app.post(
    "/users",
    {
      schema: {
        summary: "Create user",
        tags: ["Users"],
        body: CreateUserSchema,
      },
    },
    controller.create
  );

  // PUT update user
  app.put(
    "/users/:id",
    {
      schema: {
        summary: "Update user",
        tags: ["Users"],
        params: UserIdSchema,
        body: UpdateUserSchema,
      },
    },
    controller.update
  );

  // DELETE user
  app.delete(
    "/users/:id",
    {
      schema: {
        summary: "Delete user",
        tags: ["Users"],
        params: UserIdSchema,
      },
    },
    controller.delete
  );
};
