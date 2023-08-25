import client from "../../Axios"
import indexDBHandler from "../../IndexDBHandler";
function format() {
    const inputContainer = document.getElementById('input-container');
    const conversationMessages = document.getElementsByClassName('conversation-messages')[0];
    inputContainer.style.height = 60 + "px"
    conversationMessages.style.height = `calc(100vh - 70px - ${60}px`
}
function autoResize() {
    const textarea = document.getElementById('textarea');
    const inputContainer = document.getElementById('input-container');
    const conversationMessages = document.getElementsByClassName('conversation-messages')[0];

    let height = 60;
    inputContainer.style.alignItems = "center"
    if (textarea.scrollHeight > 60) {
        inputContainer.style.alignItems = "end"
        if (textarea.scrollHeight < 200) {
            height = textarea.scrollHeight
        } else if (textarea.scrollHeight >= 200) {
            height = 200;
        }
    }
    if (textarea.value == "") {
        inputContainer.style.alignItems = "center"
        textarea.style.scrollHeight = 0;
        height = 60;
    }
    inputContainer.style.height = height + "px"
    conversationMessages.style.height = `calc(100vh - 70px - ${height}px`
}
async function SendMsg(token, cid, text, setText, format, setMessages, user, currentConversationUserDetail, socket) {

    const data = {
        chatId: cid,
        type: "text",
        msg: text
    }
    setText("")
    format();
    //  msg, senderId ,msgState , uid , _id ,type
    var uid = user.id
    var _id = Date.now()
    setMessages((pre) => {
        return [...pre, { ...data, senderId: uid, msgState: "sending", uid, _id }]
    })
    try {
        const res = await client.post("/message/send", data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        setMessages(pre => {
            return pre.map(msg => {
                if (msg._id === _id) {
                    return res.data;
                }
                return msg;
            })
        })

        // add data to indexDB
        indexDBHandler.addNewMessageToChatId(cid,res.data)
        //msg after sent 
        socket.emit("sendMsg", { msg: res.data, target: currentConversationUserDetail._id, user: { name: user.name, profilePicture: user.profilePicture } })
        

    } catch (err) {
        console.log(err)
        setMessages(pre => {
            return pre.map(msg => {
                if (msg._id === _id) {
                    return { ...msg, msgState: "error" }
                }
                return msg;
            })
        })
        alert("cannot send msg")
    }
}


function handleEnter(e, token, cid, text, setText, format, setMessages, user, currentConversationUserDetail, socket) {
    if (e.key === "Enter") {
        SendMsg(token, cid, text, setText, format, setMessages, user, currentConversationUserDetail, socket)
    }
}


export { autoResize, format, SendMsg, handleEnter }