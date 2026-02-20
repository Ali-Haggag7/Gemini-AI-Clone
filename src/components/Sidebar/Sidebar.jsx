import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Sidebar = () => {

    const [extended, setExtended] = useState(false)
    const { onSent, prevPrompts, setResentPrompt, newChat } = useContext(Context)

    const loadPrompt = async (prompt) => {
        setResentPrompt(prompt)
        await onSent(prompt)
    }

    return (
        <div className='sidebar'>
            <div className="top">  {/* Top */}
                <img className='menu' src={assets.menu_icon} alt="" onClick={() => setExtended(!extended)} />  {/* 1 */}
                <div onClick={() => newChat()} className="new-chat ">  {/* 2 */}
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended
                    ? <div className="resent">  {/* 3 */}
                        <p className="resent-title">Resent</p>
                        {prevPrompts.map((item, index) => {
                            return (
                                <div key={index} onClick={() => loadPrompt(item)} className="resent-entry">
                                    <img src={assets.message_icon} alt="" />
                                    <p>{item.slice(0, 18)} ...</p>
                                </div>
                            )
                        })}
                    </div>
                    : null
                }
            </div>
            <div className="bottom">  {/* Bottom */}
                <div className="bottom-item resent-entry">    {/* item 1 */}
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item resent-entry">    {/* item 2 */}
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item resent-entry">    {/* item 3 */}
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar