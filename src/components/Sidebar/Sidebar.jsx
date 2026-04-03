import React, { useContext, useCallback, memo } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

// Memoized to prevent unnecessary re-renders from parent state
const Sidebar = memo(() => {
    // Note: State managed locally, but context provides the heavy lifting
    const [extended, setExtended] = React.useState(false);

    // Note: I left setResentPrompt as-is to not break your context, 
    // but you should rename it to setRecentPrompt in your Context.jsx!
    const { onSent, prevPrompts, setResentPrompt, newChat } = useContext(Context);

    // Stable ref for toggling
    const toggleSidebar = useCallback(() => {
        setExtended(prev => !prev);
    }, []);

    // Stable ref for loading prompts
    const loadPrompt = useCallback(async (prompt) => {
        setResentPrompt(prompt);
        await onSent(prompt);
    }, [onSent, setResentPrompt]);

    return (
        <aside className={`sidebar ${extended ? 'extended' : ''}`} aria-label="Main Navigation">
            <div className="top">
                <button
                    className="menu-btn"
                    onClick={toggleSidebar}
                    aria-expanded={extended}
                    aria-label="Toggle menu"
                >
                    <img className='menu-icon' src={assets.menu_icon} alt="" />
                </button>

                <button onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt="New Chat" />
                    {/* Mount-Once: Element stays in DOM, toggled via CSS */}
                    <span className="text-content">New Chat</span>
                </button>

                <div className="recent-container">
                    <p className="recent-title text-content">Recent</p>

                    <div className="recent-list">
                        {prevPrompts.map((item, index) => (
                            <button
                                key={index} /* Note: Use a unique ID here instead of index if possible */
                                onClick={() => loadPrompt(item)}
                                className="recent-entry"
                            >
                                <img src={assets.message_icon} alt="" />
                                {/* CSS handles truncation via ellipsis, no JS slicing needed */}
                                <p className="text-content prompt-text">{item}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bottom">
                <button className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="Help" />
                    <span className="text-content">Help</span>
                </button>
                <button className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="Activity" />
                    <span className="text-content">Activity</span>
                </button>
                <button className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings" />
                    <span className="text-content">Settings</span>
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;