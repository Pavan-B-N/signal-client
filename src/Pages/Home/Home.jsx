import "./Home.css"
import ConversationsList from "../../Components/Conversations/ConversationsList"
import ChatTemplate from "../../Components/ChatTemplate/ChatTemplate"
function Home() {
    
    return (
        <>
            <div className="home-container">
                <div className="home-left-activity" id="chat-list">
                    <ConversationsList />
                </div>
                <div className="home-right-activity" id="conversation-box">
                    <ChatTemplate />
                </div>
            </div>
        </>
    )
}

export default Home
