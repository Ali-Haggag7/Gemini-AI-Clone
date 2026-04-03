import React, { useContext, useCallback, memo } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = memo(() => {
    const [extended, setExtended] = React.useState(false);

    const { onSent, prevPrompts, setResentPrompt, newChat } = useContext(Context);

    const toggleSidebar = useCallback(() => {
        setExtended(prev => !prev);
    }, []);

    // Helper to close sidebar specifically on mobile interactions
    const closeSidebar = useCallback(() => {
        setExtended(false);
    }, []);

    // Wraps new chat to also close the menu on mobile
    const handleNewChat = useCallback(() => {
        newChat();
        closeSidebar();
    }, [newChat, closeSidebar]);

    const loadPrompt = useCallback(async (prompt) => {
        setResentPrompt(prompt);
        await onSent(prompt);
        closeSidebar(); // Auto-close drawer after selection for better UX
    }, [onSent, setResentPrompt, closeSidebar]);

    return (
        <>
            {/* * Dedicated Mobile Backdrop:
              * Replaces the heavy box-shadow hack to prevent rendering flashes.
              * Captures outside clicks to close the drawer naturally.
              */}
            <div
                className={`mobile-backdrop ${extended ? 'active' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

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

                    <button onClick={handleNewChat} className="new-chat">
                        <img src={assets.plus_icon} alt="New Chat" />
                        <span className="text-content">New Chat</span>
                    </button>

                    <div className="recent-container">
                        <p className="recent-title text-content">Recent</p>

                        <div className="recent-list">
                            {prevPrompts.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => loadPrompt(item)}
                                    className="recent-entry"
                                >
                                    <img src={assets.message_icon} alt="" />
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
        </>
    );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;