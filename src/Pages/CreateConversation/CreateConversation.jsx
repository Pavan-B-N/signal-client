import "./CreateConversation.css"
import UsersList from "../../Components/UsersList/UsersList"
import ChatTemplate from "../../Components/ChatTemplate/ChatTemplate"
import { Typography } from "@mui/material"
import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function CreateConversation() {
    return (
        <>

            <div className="create-conversation-container">
                <div className="create-conversation-left-activity" >
                    <div className="create-conversation-title-bar">
                        <Link to="/"><ArrowBackIcon /></Link>
                        <Typography variant='h5' sx={{ m: "10px" }}>Create Conversations</Typography>
                    </div>
                    <UsersList />
                </div>
                <div className="create-conversation-right-activity" >
                    <ChatTemplate />
                </div>
            </div>
        </>
    )
}

export default CreateConversation
