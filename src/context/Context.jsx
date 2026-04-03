import { createContext, useState, useRef, useMemo, useCallback } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Stable ref to track and cancel timeouts, preventing memory leaks and overlapping text
    const typingTimeouts = useRef([]);

    // --- Helper: Clean up active typing animations ---
    const clearTypingTimeouts = useCallback(() => {
        typingTimeouts.current.forEach(clearTimeout);
        typingTimeouts.current = [];
    }, []);

    // --- Helper: Reset states for a new chat ---
    const newChat = useCallback(() => {
        clearTypingTimeouts();
        setLoading(false);
        setShowResult(false);
        setResultData("");
    }, [clearTypingTimeouts]);

    // --- Helper: GPU-Friendly Typing Effect ---
    const delayPara = useCallback((index, nextWord) => {
        const timeoutId = setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 30 * index); // Sped up to 30ms for a snappier, modern feel

        typingTimeouts.current.push(timeoutId);
    }, []);

    // --- Main Action: Fetch and Stream ---
    const onSent = useCallback(async (promptOverride) => {
        clearTypingTimeouts();
        setResultData("");
        setLoading(true);
        setShowResult(true);

        const finalPrompt = promptOverride !== undefined ? promptOverride : input;

        if (!finalPrompt.trim()) {
            setLoading(false);
            return;
        }

        setPrevPrompts((prev) => [...prev, finalPrompt]);
        setRecentPrompt(finalPrompt);

        try {
            // We map prevPrompts to the format Gemini expects: { role: "user" | "model", parts: [{ text: "" }] }
            // For now, to keep it simple, we'll send the prompt and the history logic
            const response = await run(finalPrompt);

            // 1. Hyper-optimized Regex parsing (Faster & cleaner than split/loops)
            let formattedResponse = response
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text
                .replace(/\*/g, "• ")                   // Bullet points
                .replace(/\n/g, "<br/>");               // Line breaks (No spaces to prevent token tearing)

            // 2. Apply Typing Effect safely
            const responseWords = formattedResponse.split(" ");

            for (let i = 0; i < responseWords.length; i++) {
                const nextWord = responseWords[i];
                delayPara(i, nextWord + " ");
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            setResultData("<span style='color:#ff5546; font-weight:500;'>Error: Failed to connect to Gemini. Check your API Key or Network.</span>");
        } finally {
            setLoading(false);
            setInput("");
        }
    }, [input, clearTypingTimeouts, delayPara]);

    // --- Memoize Context Value to prevent cascading re-renders across the app ---
    const contextValue = useMemo(() => ({
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }), [prevPrompts, onSent, recentPrompt, showResult, loading, resultData, input, newChat]);

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;