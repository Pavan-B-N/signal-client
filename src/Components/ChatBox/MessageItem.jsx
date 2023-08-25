//message item
import AccessTimeIcon from '@mui/icons-material/AccessTime';//sending icon
import CheckIcon from '@mui/icons-material/Check';//sentIcon
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

function MessageItem(props) {
    const { msg, senderId, msgState, createdAt } = props.msg

    const { uid } = props
    return (
        <>
            <div className={`msg-container ${senderId === uid ? "own-msg-container" : "othrs-msg-container"}`}>
                <div className={`msg-box ${senderId === uid ? "own-msg-box" : "others-msg-box"}`}>
                    <p>{msg}</p>
                    <div className="time">{createdAt}</div>
                    {
                        senderId === uid &&
                        <div className="msg-state" >
                            {(msgState == "seen" && <VisibilityIcon sx={{ height: "15px" }} />)}
                            {(msgState == "sending" && <AccessTimeIcon sx={{ height: "15px" }} />)}
                            {(msgState == "sent" && <CheckIcon sx={{ height: "18px" }} />)}
                            {(msgState == "error" && <CancelIcon sx={{ height: "18px", color: "#FEA1A1" }} />)}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default MessageItem;