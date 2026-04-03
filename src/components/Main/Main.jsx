import React, { useContext, useCallback, memo, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const SUGGESTION_CARDS = [
    { text: "Suggest beautiful places to see on an upcoming road trip", icon: assets.compass_icon },
    { text: "Briefly summarize this concept: urban planning", icon: assets.bulb_icon },
    { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
    { text: "Improve the readability of the following code", icon: assets.code_icon }
];

const GreetingView = memo(({ onLoadPrompt }) => (
    <div className="greet-view">
        <div className="greet">
            <p><span>Hello, Dev.</span></p>
            <p>How can I help you today?</p>
        </div>
        <div className="cards">
            {SUGGESTION_CARDS.map((card, index) => (
                <button
                    key={index}
                    className="card"
                    onClick={() => onLoadPrompt(card.text)}
                    aria-label={card.text}
                >
                    <p>{card.text}</p>
                    <img src={card.icon} alt="" loading="lazy" decoding="async" />
                </button>
            ))}
        </div>
    </div>
));
GreetingView.displayName = "GreetingView";

const ResultView = memo(({ recentPrompt, loading, resultData, chatHistory = [] }) => (
    <div className='result'>
        {chatHistory.map((chat, index) => (
            <div key={index} className={chat.role === "user" ? "result-title" : "result-data"}>
                <img src={chat.role === "user" ? assets.user_icon : assets.gemini_icon} alt="" />
                <p
                    dir="auto"
                    dangerouslySetInnerHTML={{
                        __html: chat.parts[0].text
                            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                            .replace(/\*/g, "• ")
                            .replace(/\n/g, "<br/>")
                    }}
                />
            </div>
        ))}

        {loading || resultData ? (
            <>
                <div className="result-title">
                    <img src={assets.user_icon} alt="User" />
                    <p dir="auto">{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img
                        src={assets.gemini_icon}
                        alt="Gemini"
                        className={`gemini-icon ${loading ? 'thinking' : ''}`}
                    />
                    {loading && !resultData ? (
                        <div className='loader'>
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line short" />
                        </div>
                    ) : (
                        <p
                            dir="auto"
                            className="fade-in-text"
                            dangerouslySetInnerHTML={{ __html: resultData }}
                        />
                    )}
                </div>
            </>
        ) : null}

        {/*
         * Sentinel element — scrolled into view whenever history or resultData
         * changes. Lives inside ResultView so it's always at the bottom of content.
         */}
        <div className="scroll-anchor" />
    </div>
));
ResultView.displayName = "ResultView";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, chatHistory } = useContext(Context);

    // Ref points to the scroll container (view-stack), not the content
    const scrollContainerRef = useRef(null);
    const anchorRef = useRef(null);

    // Scroll to bottom whenever content grows
    useEffect(() => {
        if (!scrollContainerRef.current) return;
        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [resultData, loading, chatHistory]);

    const handleLoadPrompt = useCallback(async (promptText) => {
        setInput(promptText);
        await onSent(promptText);
    }, [setInput, onSent]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && input.trim()) onSent();
    }, [input, onSent]);

    return (
        <main className='main'>
            <nav className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="User Profile" />
            </nav>

            <div className="main-container">
                {/*
                 * Single scroll owner. The greeting and result layers are stacked
                 * via CSS grid inside here — only this element scrolls.
                 * Giving scroll ownership to both view-stack AND .result caused
                 * two competing scroll containers, making history unreachable.
                 */}
                <div className="view-stack" ref={scrollContainerRef}>
                    <div className="stack-layer" data-active={!showResult}>
                        <GreetingView onLoadPrompt={handleLoadPrompt} />
                    </div>

                    <div className="stack-layer" data-active={showResult}>
                        <ResultView
                            recentPrompt={recentPrompt}
                            loading={loading}
                            resultData={resultData}
                            chatHistory={chatHistory ?? []}
                        />
                    </div>
                </div>

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            dir="auto"
                            placeholder='Enter a prompt here'
                            onKeyDown={handleKeyDown}
                        />
                        <div className="actions">
                            <button className="icon-btn" aria-label="Upload Image">
                                <img src={assets.gallery_icon} alt="" />
                            </button>

                            <div className="mic-send-wrapper">
                                <button
                                    className="icon-btn mic-btn"
                                    data-visible={!input.trim()}
                                    aria-label="Voice Input"
                                >
                                    <img src={assets.mic_icon} alt="" />
                                </button>

                                <button
                                    className="icon-btn send-btn"
                                    data-visible={!!input.trim()}
                                    onClick={() => onSent()}
                                    aria-label="Send Prompt"
                                >
                                    <img src={assets.send_icon} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className='bottom-info'>
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Main;