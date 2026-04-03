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
    const [chatHistory, setChatHistory] = useState([]);

    const typingTimeouts = useRef([]);

    const clearTypingTimeouts = useCallback(() => {
        typingTimeouts.current.forEach(clearTimeout);
        typingTimeouts.current = [];
    }, []);

    const newChat = useCallback(() => {
        clearTypingTimeouts();
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setChatHistory([]);
    }, [clearTypingTimeouts]);

    const delayPara = useCallback((index, nextWord) => {
        const id = setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 30 * index);
        typingTimeouts.current.push(id);
    }, []);

    const onSent = useCallback(async (promptOverride) => {
        clearTypingTimeouts();

        const finalPrompt = promptOverride !== undefined ? promptOverride : input;
        if (!finalPrompt.trim()) return;

        // Don't wipe resultData here — let the loading state handle the UI.
        // Wiping it immediately caused the previous response to flash away.
        setLoading(true);
        setShowResult(true);
        setResultData("");
        setPrevPrompts((prev) => [...prev, finalPrompt]);
        setRecentPrompt(finalPrompt);

        try {
            const response = await run(finalPrompt, chatHistory);
            const safeResponse = typeof response === "string" && response ? response : null;

            if (!safeResponse) throw new Error("Empty response from Gemini");

            // Append this turn to history so the next call has full context
            setChatHistory(prev => [
                ...prev,
                { role: "user", parts: [{ text: finalPrompt }] },
                { role: "model", parts: [{ text: safeResponse }] },
            ]);

            const formatted = safeResponse
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/\*/g, "• ")
                .replace(/\n/g, "<br/>");

            formatted.split(" ").forEach((word, i) => delayPara(i, word + " "));

        } catch (err) {
            console.error("Gemini API Error:", err);
            setResultData("<span style='color:#ff5546;font-weight:500;'>Error: " + err.message + "</span>");
        } finally {
            setLoading(false);
            setInput("");
        }
    }, [input, chatHistory, clearTypingTimeouts, delayPara]);

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
        newChat,
        chatHistory,      // ← this was the missing piece
    }), [prevPrompts, onSent, recentPrompt, showResult, loading, resultData, input, newChat, chatHistory]);

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;