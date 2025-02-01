//import server
import serverHandler from "./ServerHandler"
import indexDBHandler from "./IndexDBHandler"
import client from "./Axios";
import { deleteDatabase } from "./IndexedBDFunctions"
import openChatAudio from "./Audios/openChat.mp3"
import closeChatAudio from "./Audios/closeChat.wav"

async function fetchChatsFromIndexDB(setChats) {
    try {
        const chats = await indexDBHandler.fetchChats();
        setChats(chats)
    } catch (err) {
        console.log(err)
    }
}
function fetchChatsFromServer() {
    const promise = new Promise(async (resolve, reject) => {
        try {
            const chats = await serverHandler.fetchChats();
            //store chats in indexDB then update the chats 
            await indexDBHandler.storeChats(chats);
            resolve(chats)
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
    return promise;
}
function fetchAndStoreMessages(chats) {
    const promise = new Promise(async (resolve, reject) => {
        for await (const chat of chats) {
            const messages = await serverHandler.fetchMessages(chat._id)
            //store messages to indexDB
            indexDBHandler.storeMessages(messages, chat._id)
        }
        resolve(true)
    })
    return promise;
}
function fireMessageUpdatedEvent(chatId) {
    //triggered when message get updated in indexDB
    const msgUpdateEvent = new CustomEvent("messageUpdated", { detail: { chatId } })
    document.dispatchEvent(msgUpdateEvent)
}
function getPushSubscription() {
    const promise = new Promise(async (resolve, reject) => {
        const publicKey = process.env.REACT_APP_PUBLIC_KEY;
        console.log('publicKey',JSON.stringify(publicKey))

        const sw = await navigator.serviceWorker.ready;
        console.log('sw',JSON.stringify(sw))
        
        try {
            const push = await sw.pushManager.subscribe({ applicationServerKey: publicKey, userVisibleOnly: true })
            console.log('push',JSON.stringify(push))
            resolve(push)
        } catch (err) {
            console.log(err)
        }
        resolve(undefined)
    })
    return promise;
}
async function subscribeToPushNotification(userId) {
    const promise = new Promise(async (resolve, reject) => {
        managePermissions()
        const pushSubscription = await getPushSubscription();
        if (!pushSubscription) {
            localStorage.setItem("isPushNotificationRegistered", false)
            return resolve(false)
        }
        const data = { uid: userId, userAgent: navigator.userAgent, pushSubscription: JSON.stringify(pushSubscription) }
        try {
            await client.post("/pnRegister", data);
            await indexDBHandler.storePushSubscription(pushSubscription)
            localStorage.setItem("isPushNotificationRegistered", true)
            resolve(true)
        }
        catch (err) {
            if (err.response.status == 403) {
                await indexDBHandler.storePushSubscription(pushSubscription)
                localStorage.setItem("isPushNotificationRegistered", true)
                resolve(true)
            } else {
                console.log(err)
                resolve(false)
            }
        }
    })
    return promise;
}
function unSubscribePushNotification() {
    const promise = new Promise(async (resolve, reject) => {
        try {
            var pushSubscription = await indexDBHandler.getPushSubscription()
        } catch (err) {
            resolve(false)
            console.log(err)
        }
        const { id } = JSON.parse(localStorage.getItem("profile"))
        const data = { uid: id, userAgent: navigator.userAgent, pushSubscription }
        try {
            await client.post("/pnUnregister", data)
            resolve(true)
        } catch (err) {

            // alert("logout later unable to reach server");
            // console.log(err)
            // reject("cannot reach server");
            resolve(true)
        }

    });
    return promise;
}
async function Logout(setIsloggingOut) {
    setIsloggingOut(true)
    try {
        console.log("unsubscribing ...")
        await unSubscribePushNotification()
        console.log("deleting indexDb")
        await deleteDatabase();
        console.log("clearing localStrorage")
        localStorage.clear();
        console.log("done..")
        setTimeout(()=>{
            window.location.reload()
        },5000)
    }catch(err){
        setIsloggingOut(false)
        window.location.reload();
    }
    
}
function managePermissions() {
    let permission = Notification.permission;
    console.log('permission',permission)
    if (permission === "default") {
        Notification.requestPermission()
    } else if (permission == "denied") {
        alert("Allow Notifications");
    }
}
async function notifyMessage() {
    showNotification("signal", "1 new message")
}

async function showNotification(title, body) {
    const permission = Notification.permission
    if (permission == "granted") {
        const notification = new Notification(title, { body })
        notification.onclick = () => {
            window.open(`/`)
        }
    }
}

function HandleNewMessage(e, currentChatID) {
    const msg = e.detail
    NotifyNewMessageToUser(msg, currentChatID);
    indexDBHandler.addNewMessageToChatId(msg.chatId, msg)
}
function NotifyNewMessageToUser(msg, currentChatID) {
    if (document.hidden) {
        notifyMessage()
    } else if (msg.chatId === currentChatID) {
        console.log("match")
        const audio = new Audio(openChatAudio);
        audio.load()
        audio.play();
    } else {
        const audio = new Audio(closeChatAudio);
        audio.load()
        audio.play();
    }
}

async function updateData(setIsSyncing, setChats) {
    setIsSyncing(true)
    //fetch chats from server and store it in indexDB
    const chats = await fetchChatsFromServer()
    setChats(chats)
    //fetch all messages from the server and store it in indexDB
    await fetchAndStoreMessages(chats)
    setIsSyncing(false)
}

export {
    fetchChatsFromIndexDB,
    fetchChatsFromServer,
    fireMessageUpdatedEvent,
    fetchAndStoreMessages,
    Logout,
    subscribeToPushNotification,
    HandleNewMessage,
    updateData,
    managePermissions
}