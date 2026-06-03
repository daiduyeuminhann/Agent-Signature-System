import Fastify from "fastify";

import plannerRoute 
from "./routes/plannerRoute.js";

const fastify = Fastify({
  logger: true
});

await fastify.register(
  plannerRoute
);

try {

  await fastify.listen({
    port: 3000,
    host: "0.0.0.0"
  });

  console.log(
    "Server running on port 3000"
  );

} catch (err) {

  fastify.log.error(err);

  process.exit(1);
}