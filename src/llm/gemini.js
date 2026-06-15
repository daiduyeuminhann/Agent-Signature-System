import dotenv from "dotenv";

import {
  GoogleGenerativeAI
}
from "@google/generative-ai";

dotenv.config();

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

export const gemini =
  genAI.getGenerativeModel({

    model:
      "gemini-1.5-flash"
  });