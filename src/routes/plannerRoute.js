import { runPlanner }
    from "../planner/plannerService.js";

import { parseJson }
    from "../utils/parseJson.js";

import { plannerSchema }
    from "../schemas/plannerSchema.js";

export default async function (
    fastify
) {

    fastify.post(
        "/plan",

        async (request, reply) => {

            try {

                const { prompt } =
                    request.body;

                if (!prompt) {

                    return reply.status(400).send({
                        success: false,
                        error: "Prompt is required"
                    });
                }

                // run AI planner
                const raw =
                    await runPlanner(prompt);

                // parse AI output
                const parsed =
                    parseJson(raw);

                console.log(
                    "RAW AI RESPONSE:",
                    raw
                );

                console.log(
                    "PARSED:",
                    parsed
                );
                // validate schema
                const validated =
                    plannerSchema.parse(parsed);

                return {
                    success: true,
                    data: validated
                };

            } catch (error) {

                console.error(error);

                return reply.status(500).send({
                    success: false,
                    error: error.message
                });
            }
        }
    );
}