import Fastify from "fastify";
import agentRoute from "./routes/agentRoute.js";

const fastify = Fastify({ logger: true });

fastify.register(agentRoute);

try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}