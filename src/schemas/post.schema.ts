import z from "zod";

export const PostIdSchema = z.object({ id: z.uuid() });

export const CreatePostSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
  authorId: z.uuid().optional(),
});
export type CreatePost = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().min(2).optional(),
  authorId: z.uuid().optional(),
});
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
