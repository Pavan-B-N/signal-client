import "./Chat.css"
import ConversationsList from '../../Components/Conversations/ConversationsList'
import ChatBox from "../../Components/ChatBox/ChatBox"
function Chat() {
  return (
    <>
      <div className="chat-container">
        <div className="chat-left-activity" id="chat-list">
          <ConversationsList />
        </div>
        <div className="chat-right-activity" id="conversation-box">
          <ChatBox />
        </div>
      </div>
    </>
  )
}

export default Chat
