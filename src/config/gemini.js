import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Executes a chat-based multi-turn conversation with the Gemini API.
 * This implementation persists the context of the conversation.
 * * @param {string} prompt - The current user message.
 * @param {Array} history - The previous messages in the conversation.
 * @returns {string} - The AI's response text.
 */
async function run(prompt, history = []) {
  try {
    // Note: Using 'gemini-1.5-flash' as it's the stable production standard for speed/context.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Start a chat session with the provided history array
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return "Error: Unable to fetch response. Please check your API key or connection.";
  }
}

export default run;