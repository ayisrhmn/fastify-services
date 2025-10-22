// Contoh pemakaian fastify hooks pakai done tanpa async/await

import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

interface PrismaPluginOptions extends FastifyPluginOptions {
  log?: boolean;
}

const prisma = new PrismaClient();

function prismaPlugin(
  app: FastifyInstance,
  opts: PrismaPluginOptions,
  done: () => void
) {
  app.decorate("prisma", prisma);

  if (opts.log) {
    console.log("Prisma plugin registered (with log)");
  }

  app.addHook("onClose", (app, done) => {
    app.prisma.$disconnect();

    done();
  });

  done();
}

export default fp(prismaPlugin);

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
