import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    // Note: Typo fixed from 'resentPrompt' to 'recentPrompt'
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Function to create a typing effect by delaying text rendering
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        }, 75 * index); // 75ms delay for a realistic typing speed
    };

    // Reset states for a new chat session
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    // Handle sending the prompt to the Gemini API
    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        // Determine the final prompt: use the provided prompt or the input state
        let finalPrompt = prompt !== undefined ? prompt : input;

        setPrevPrompts((prev) => [...prev, finalPrompt]);
        setRecentPrompt(finalPrompt);

        try {
            // Fetch response from Gemini API
            response = await run(finalPrompt);

            // --- 1. Format Bold Text (**) ---
            let responseArray = response.split("**");
            let formattedResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i % 2 === 1) {
                    formattedResponse += "<b>" + responseArray[i] + "</b>"; // Bold text
                } else {
                    formattedResponse += responseArray[i]; // Normal text
                }
            }

            // --- 2. Format Line Breaks (\n) and Bullet Points (*) ---
            // Replace single asterisks with a bullet point symbol
            let formattedWithBullets = formattedResponse.split("*").join("• ");
            // Replace newline characters with HTML break tags to prevent clustered text
            let finalFormattedResponse = formattedWithBullets.split("\n").join("<br />");

            // --- 3. Apply Typing Effect ---
            let newResponseArray = finalFormattedResponse.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }

        } catch (error) {
            console.error("Error while fetching from Gemini API:", error);
            // Display a user-friendly error message in red
            setResultData("<span style='color:red;'>Error: Something went wrong. Check your connection or API Key.</span>");
        } finally {
            // Stop loading and clear input regardless of success or failure
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt, // Updated name
        recentPrompt,    // Updated name
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;