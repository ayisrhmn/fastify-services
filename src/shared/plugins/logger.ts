// Contoh pemakaian fastify hooks pakai done tanpa async/await

import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

function loggerPlugin(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void
) {
  const enabled = opts.enabled ?? true;

  if (!enabled) {
    done();
    return;
  }

  app.addHook("onRequest", (req, reply, done) => {
    console.log(
      `[LOG] Incoming → ${req.method} ${req.url} [${reply.statusCode}]`
    );
    done();
  });

  app.addHook("onResponse", (req, reply, done) => {
    console.log(`[LOG] Done → ${req.method} ${req.url} [${reply.statusCode}]`);
    done();
  });

  console.log(`[LOG] Logger plugin initialized`);
  done();
}

export default fp(loggerPlugin);
