import { groq }
from "./groq.js";

import { gemini }
from "./gemini.js";

export async function callGroq(
  systemPrompt,
  userPrompt
) {

  const completion =
    await groq.chat.completions.create({

      model:
        "openai/gpt-oss-120b",

      response_format: {
        type: "json_object"
      },

      messages: [

        {
          role: "system",
          content: systemPrompt
        },

        {
          role: "user",
          content: userPrompt
        }
      ]
    });

  return JSON.parse(

    completion
      .choices[0]
      .message
      .content
  );
}

export async function callGemini(
  fullPrompt
) {

  const result =
    await gemini.generateContent(
      fullPrompt
    );

  return JSON.parse(
    result.response.text()
  );
}

export async function callOpenRouter(

  systemPrompt,
  userPrompt
) {

  const completion =
    await openrouter
      .chat
      .completions
      .create({

      model:
        "minimax/minimax-m2.5:free",

      temperature: 0,

      response_format: {
        type: "json_object"
      },

      messages: [

        {
          role: "system",
          content: systemPrompt
        },

        {
          role: "user",
          content: userPrompt
        }
      ]
    });

  return JSON.parse(

    completion
      .choices[0]
      .message
      .content
  );
}