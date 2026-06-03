export function parseJson(text) {

  try {
    return JSON.parse(text);
  } catch (err) {

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }
}