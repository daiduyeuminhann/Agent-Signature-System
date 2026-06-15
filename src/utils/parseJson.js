export function parseJson(data) {

  // already object
  if (
    typeof data === "object"
  ) {
    return data;
  }

  try {

    return JSON.parse(data);

  } catch (err) {

    const cleaned = data

      .replace(/```json/g, "")

      .replace(/```/g, "")

      .trim();

    return JSON.parse(cleaned);
  }
}