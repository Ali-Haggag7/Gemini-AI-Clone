/**
 * Advanced Fetch for Gemini 2.5
 * Supports Multi-turn conversations by passing chat history.
 */
async function run(prompt, chatHistory = []) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  /* Constructing the contents array:
     1. Spread the existing chatHistory (previous User/Model turns).
     2. Append the current user prompt as the final entry.
  */
  const contents = [
    ...chatHistory,
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ];

  try {
    console.log("--- SYSTEM: SENDING DATA TO GEMINI 2.5 (WITH CONTEXT) ---");

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: contents })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Response:", data);
      throw new Error(data.error?.message || "Generation Failed");
    }

    /* Robust parsing to extract text from Gemini's nested JSON structure */
    const textResult =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.text ||
      data?.text ||
      null;

    if (textResult) {
      console.log("--- SYSTEM: PARSING SUCCESSFUL ---");
      return textResult;
    } else {
      console.warn("--- SYSTEM: UNEXPECTED JSON STRUCTURE ---", data);
      return "Error: Response format not recognized. Check console for details.";
    }

  } catch (error) {
    console.error("--- FETCH ERROR ---", error);
    return `Critical Error: ${error.message}`;
  }
}

export default run;