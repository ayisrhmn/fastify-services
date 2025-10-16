import { z } from "zod";

export const UserIdSchema = z.object({ id: z.uuid() });

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
