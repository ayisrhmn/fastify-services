import fastify from "fastify";
import { env } from "./plugins/env";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import prismaPlugin from "./plugins/prisma";
import { userRoutes } from "./routes/user";
import { postRoutes } from "./routes/post";

export const app = fastify();

// Enable cors
app.register(cors, {
  origin: "*",
});

// Swagger setup
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Fastify API",
      description: "API for learning fastify.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

// Zod setup
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register prisma plugin
app.register(prismaPlugin);

// Register routes
app.register(userRoutes);
app.register(postRoutes);

// Run server
app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("Server running on port " + env.PORT);
});
