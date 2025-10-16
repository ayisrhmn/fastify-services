import type { FastifyInstance } from "fastify";
import {
  CreatePostSchema,
  PostIdSchema,
  UpdatePostSchema,
} from "../schemas/post.schema";
import { postController } from "../controllers/post.controller";

export const postRoutes = (app: FastifyInstance) => {
  const controller = postController(app);

  // GET all posts
  app.get(
    "/posts",
    { schema: { summary: "List all posts", tags: ["Posts"] } },
    controller.getAll
  );

  // GET post by id
  app.get(
    "/posts/:id",
    {
      schema: {
        summary: "Get post by id",
        tags: ["Posts"],
        params: PostIdSchema,
      },
    },
    controller.getById
  );

  // POST create post
  app.post(
    "/posts",
    {
      schema: {
        summary: "Create post",
        tags: ["Posts"],
        body: CreatePostSchema,
      },
    },
    controller.create
  );

  // PUT update post
  app.put(
    "/posts/:id",
    {
      schema: {
        summary: "Update post",
        tags: ["Posts"],
        params: PostIdSchema,
        body: UpdatePostSchema,
      },
    },
    controller.update
  );

  // DELETE post
  app.delete(
    "/posts/:id",
    {
      schema: {
        summary: "Delete post",
        tags: ["Posts"],
        params: PostIdSchema,
      },
    },
    controller.delete
  );
};
