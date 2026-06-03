import { client }
from "./model.js";

import { plannerPrompt }
from "./prompt.js";

const MODELS = [

  "meta-llama/llama-3.3-70b-instruct:free",

  "meta-llama/llama-3.2-3b-instruct:free",

  "deepseek/deepseek-v4-flash:free",

  "minimax/minimax-m2.5:free",

  "moonshotai/kimi-k2.6:free",

  "google/gemma-4-26b-a4b-it:free",
  
  "qwen/qwen3-coder:free",

  "nousresearch/hermes-3-llama-3.1-405b:free",

  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free"
];

export async function runPlanner(
  userPrompt
) {

  for (const model of MODELS) {

    try {

      console.log(
        "Trying model:",
        model
      );

      const completion =
        await client.chat.completions.create({

          model,

          messages: [
            {
              role: "system",
              content: plannerPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ]
        });

      return completion
        .choices[0]
        .message
        .content;

    } catch (err) {

      console.log(
        "Model failed:",
        model
      );

      console.log(err.message);
    }
  }

  throw new Error(
    "All models failed"
  );
}