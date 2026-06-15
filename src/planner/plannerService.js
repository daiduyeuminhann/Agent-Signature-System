import {

  callGroq,
  callOpenRouter,
  callGemini

} from "../llm/providerRouter.js";

import { plannerPrompt }
from "./prompt.js";

export async function runPlanner(
  userPrompt
) {

  // GROQ
  try {

    console.log(
      "Trying Groq..."
    );

    return await callGroq(

      plannerPrompt,
      userPrompt
    );

  } catch (err) {

    console.log(
      "Groq failed"
    );

    console.log(err.message);
  }

  // OPENROUTER
  try {

    console.log(
      "Trying OpenRouter..."
    );

    return await callOpenRouter(

      plannerPrompt,
      userPrompt
    );

  } catch (err) {

    console.log(
      "OpenRouter failed"
    );

    console.log(err.message);
  }

  // GEMINI
  try {

    console.log(
      "Trying Gemini..."
    );

    return await callGemini(

      plannerPrompt,
      userPrompt
    );

  } catch (err) {

    console.log(
      "Gemini failed"
    );

    console.log(err.message);
  }

  throw new Error(
    "All providers failed"
  );
}