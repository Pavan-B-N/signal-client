import { Avatar, Chip, Typography } from '@mui/material'
import "./ConversationsList.css"
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import AppContext from "../../AppContext"

import { Link, useParams } from 'react-router-dom'

import { fetchUserData } from "../../DataRequests"

import indexDBHandler from '../../IndexDBHandler'

function ConversationItem(props) {
  const { _id, type, members } = props.chat
  const { profile, setCurrentConversationUserDetail, setCurrentChatID } = useContext(AppContext)
  const [chatDetail, setChatDetail] = useState(null)
  const [unseenCount, setUnseenCount] = useState(0)
  const [lastMessage, setLastMessage] = useState();

  //set last message
  async function getLastMessage() {
    const msgs = await indexDBHandler.fetchMessages(_id)
    const len = msgs.length
    setLastMessage(msgs[len - 1])
    unSeenCounter(msgs);
  }
  function unSeenCounter(msgs) {
    let counter = 0;
    msgs.map(msg => {
      if (msg.senderId != profile.id && msg.msgState != "seen") {
        counter++;
      }
    })
    setUnseenCount(counter)
  }
  //try to optimize later
  useEffect(() => {
    getLastMessage()
  }, [])

  //whenever messages update for this chat pleas change the last message
  useEffect(() => {
    document.addEventListener("messageUpdated", LastMessageEventHandler)
    return () => {
      document.removeEventListener("messageUpdated", LastMessageEventHandler)
    }
  }, [])

  function LastMessageEventHandler(e) {
    const { chatId } = e.detail
    if (chatId == _id) {
      getLastMessage()
    }
  }

  useEffect(() => {
    if (type === "single") {
      fetchUserData(profile.id, members, setChatDetail)
    } else {
      const { groupName, groupProfilePicture } = props.chat
      setChatDetail({ name: groupName, profilePicture: groupProfilePicture })
    }
  }, [])

  function handleConversation() {
    setCurrentConversationUserDetail(chatDetail)
    setUnseenCount(0)
    setCurrentChatID(_id)
  }
  return (
    <>
      <div onClick={handleConversation}  >
        <Link className="chat-item-container" to={`/conversations/${_id}`} >
          <div className="chat-item">
            <Avatar sx={{ width: 42, height: 42 }} className='avatar' src={chatDetail?.profilePicture} />
            <div>
              <Typography variant='subtitle1' className='chat-item-name'>{chatDetail?.name}</Typography>
              <Typography variant='caption' className='chat-last-msg'>{lastMessage?.msg}</Typography>
            </div>
          </div>
          {unseenCount !== 0 && <Chip label={unseenCount} size='small' color="success" />}
        </Link>
      </div>
    </>
  )
}
export default ConversationItem