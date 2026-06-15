import { createSignature, mergeSignature, saveSignature }
  from "../signature/signatureClient.js";

export default async function (fastify) {

  fastify.post("/agent", async (request, reply) => {
    try {
      const { input, projectName = "", patch = {}, save = false } =
        request.body ?? {};

      if (!input) {
        return reply.status(400).send({ success: false, error: "input is required" });
      }

      const blank     = await createSignature(projectName);
      const signature = await mergeSignature(blank, {
        project: { summary: input, goals: [] },
        ...patch
      });

      if (save) await saveSignature(signature);

      return { success: true, signature };

    } catch (err) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });
}