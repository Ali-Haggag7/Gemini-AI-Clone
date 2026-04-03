import React, { useContext, useCallback, memo } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

// --- Static Data Outside Component (Prevents Re-allocation) ---
const SUGGESTION_CARDS = [
    { text: "Suggest beautiful places to see on an upcoming road trip", icon: assets.compass_icon },
    { text: "Briefly summarize this concept: urban planning", icon: assets.bulb_icon },
    { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
    { text: "Improve the readability of the following code", icon: assets.code_icon }
];

// --- Memoized Child Components ---
// These prevent the heavy UI from re-rendering when the user is just typing in the input box.

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

const ResultView = memo(({ recentPrompt, loading, resultData }) => (
    <div className='result-view'>
        <div className="result-title">
            <img src={assets.user_icon} alt="User" />
            <p dir="auto">{recentPrompt}</p>
        </div>
        <div className="result-data">
            <img src={assets.gemini_icon} alt="Gemini" className="gemini-spin" />
            {loading ? (
                <div className='loader'>
                    {/* GPU-Accelerated Skeletons */}
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                </div>
            ) : (
                <p dir="auto" className="fade-in-text" dangerouslySetInnerHTML={{ __html: resultData }}></p>
            )}
        </div>
    </div>
));
ResultView.displayName = "ResultView";


// --- Main Component ---
const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

    // Stable referential identity for the click handler
    const handleLoadPrompt = useCallback(async (promptText) => {
        setInput(promptText);
        await onSent(promptText);
    }, [setInput, onSent]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && input.trim()) {
            onSent();
        }
    }, [input, onSent]);

    return (
        <main className='main'>
            <nav className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="User Profile" />
            </nav>

            <div className="main-container">

                {/* * Mount-Once Stacking Context:
                  * Both views remain in the DOM structure (via CSS Grid stacking).
                  * This prevents layout thrashing and allows seamless GPU cross-fading.
                  */}
                <div className="view-stack">
                    <div className="stack-layer" data-active={!showResult}>
                        <GreetingView onLoadPrompt={handleLoadPrompt} />
                    </div>

                    <div className="stack-layer" data-active={showResult}>
                        <ResultView
                            recentPrompt={recentPrompt}
                            loading={loading}
                            resultData={resultData}
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
                            <button className="icon-btn" aria-label="Voice Input">
                                <img src={assets.mic_icon} alt="" />
                            </button>
                            {/* Mount-Once: Button stays in DOM to prevent layout shift */}
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
                    <p className='bottom-info'>
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Main;