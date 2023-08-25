import "./ChatBox.css"
import { useContext, useEffect, useState } from 'react'
import AppContext from "../../AppContext"
import { Avatar, IconButton, Typography } from "@mui/material"
import ScrollToBottom from "react-scroll-to-bottom"
//icons
import CallIcon from '@mui/icons-material/Call';
import DuoIcon from '@mui/icons-material/Duo';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams } from "react-router-dom/"

import MessageItem from "./MessageItem"
import client from "../../Axios"

//functions
import { autoResize, format, SendMsg, handleEnter } from "./Functions"

import indexDBHandler from "../../IndexDBHandler"
function Conversation() {
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const { currentConversationUserDetail, onlineUsers, newMessage, token, profile, socket } = useContext(AppContext)
    const { cid } = useParams()

    async function getMessagesByChatId() {
        setIsFetching(true)
        const msgs = await indexDBHandler.fetchMessages(cid)
        setMessages(msgs)
        setIsFetching(false)
        markMessagesToBeSeen(msgs)
    }

    async function markMessagesToBeSeen(messages) {
        for await (let msg of messages) {
            if (msg.senderId !== profile.id && msg.msgState !== "seen") {
                console.log(`/message/markSeen/${msg._id},`, token)
                await client.put(`/message/markSeen/${msg._id}`, null, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
            }
        }
    }


    useEffect(() => {
        //get messages of a particular person
        if (cid) {
            getMessagesByChatId()
        }
    }, [cid])

    if (!currentConversationUserDetail) {
        window.location.href = "/"
    }

    useEffect(() => {
        if (newMessage && newMessage.chatId == cid) {
            setMessages(pre => [...pre, newMessage])
        }
    }, [newMessage])


    async function markMessagesToBeSeen(messages) {
        for await (let msg of messages) {
            if (msg.senderId !== profile.id && msg.msgState !== "seen") {
                // console.log(`/message/markSeen/${msg._id},`, token)
                await client.put(`/message/markSeen/${msg._id}`, null, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
            }
        }
    }

    return (
        <>
            <div className="conversation-container">
                <div className="conversation-titlebar">
                    <div className="conversation-user-detail">
                        <Link to="/"><ArrowBackIcon /></Link>
                        <Avatar src={currentConversationUserDetail.profilePicture} />
                        <div className="conversation-userDetail">
                            <Typography className="conversation-user-name">{currentConversationUserDetail.name}</Typography>
                            <Typography variant="subtitle2" className="conversation-online-status">{onlineUsers.indexOf(currentConversationUserDetail._id) >= 0 && "online"}</Typography>
                        </div>
                    </div>

                    <div className="conversation-actions-container">
                        <CallIcon className="action-tag make-voiceCall"  />
                        <DuoIcon className="action-tag" />
                    </div>
                </div>

                {/* handle messages */}

                <ScrollToBottom className="conversation-messages" id="conversation-messages">
                    {
                        messages.length !== 0 ?
                            messages.map(obj => {
                                return <MessageItem msg={obj} uid={profile.id} key={obj._id} />
                            })
                            :
                            (
                                isFetching ?
                                    <Typography variant="h6" sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                                        fetching messages...
                                    </Typography>
                                    :
                                    <Typography variant="h6" sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                                        No messages
                                    </Typography>
                            )
                    }
                </ScrollToBottom>

                {/* input box */}
                <div className="conversation-input-container" id="input-container">
                    <div className="emoji">
                        <IconButton>
                            <EmojiEmotionsIcon sx={{ margin: "7px", color: "orange" }} />
                        </IconButton>
                    </div>

                    <textarea type="text"
                        id="textarea"
                        spellCheck={false}
                        style={{ resize: "none" }}
                        className="input-box"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                            autoResize()
                        }}
                        onKeyUp={(e) => handleEnter(e, token, cid, text, setText, format, setMessages, profile, currentConversationUserDetail, socket)} />

                    <div className="input-actions">
                        <IconButton onClick={() => SendMsg(token, cid, text, setText, format, setMessages, profile, currentConversationUserDetail, socket)}>
                            <SendIcon sx={{ margin: "7px", color: "green" }} />
                        </IconButton>
                    </div>
                </div>

            </div >
        </>
    )
}

export default Conversation
