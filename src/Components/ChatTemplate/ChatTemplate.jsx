import "./ChatTemplate.css"
import {Typography} from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
function ChatTemplate() {
  return (
    <>
      <div className="chat-template">
          <Typography variant="h4">Chat With Your Friends</Typography>
          <div className="chat-template-icons">
            <MessageIcon sx={{margin:"10px"}}/>
            <CallIcon sx={{margin:"10px"}}/>
            <VideoCallIcon sx={{margin:"10px"}}/>
          </div>
          <h3>App version : {process.env.REACT_APP_VERSION}</h3>
      </div>
    </>
  )
}

export default ChatTemplate
