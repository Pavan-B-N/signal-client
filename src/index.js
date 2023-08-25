import ReactDOM from 'react-dom/client';
import App from './App';
import AppContext from "./AppContext"
import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"

//import server
import serverHandler from "./ServerHandler"
import { fetchChatsFromIndexDB, updateData, HandleNewMessage } from "./Handler"
import { Logout } from "./Handler"
const root = ReactDOM.createRoot(document.getElementById('root'));
function Application() {
  const localhost = "http://localhost:3030";
  const remoteHost = "https://signalserver-i68m.onrender.com/";
  const baseURL = remoteHost;

  const [socketId, setSocketId] = useState(null);
  const socketRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoggingOut, setIsloggingOut] = useState(false)

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null)
  const [currentConversationUserDetail, setCurrentConversationUserDetail] = useState(null)

  const [onlineUsers, setOnlineUsers] = useState([]);

  //try to implement event and reduce global state
  const [newMessage, setNewMessage] = useState(null)

  //server updates
  const [chats, setChats] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false)

  const [isSetUpDone, setIsSetUpDone] = useState(false)

  const [currentChatID, setCurrentChatID] = useState()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true)
      setToken(JSON.parse(localStorage.getItem("token")))
      setProfile(JSON.parse(localStorage.getItem("profile")))
      setIsSetUpDone(JSON.parse(localStorage.getItem("isSetUpDone")))
    }
  }, [])

  //handlin receiveMessage event
  useEffect(() => {
    // console.log("adding..")
    document.addEventListener("receiveMessage",(e)=> HandleNewMessage(e,currentChatID))
    return () => {
      // console.log("cleaning.. ")
      document.removeEventListener("receiveMessage",(e)=> HandleNewMessage(e,currentChatID))
    };
  }, [currentChatID])

  //if app version is changed then it means app updated so logout
  useEffect(() => {
    const isAppUpdated = process.env.REACT_APP_VERSION != localStorage.getItem("appVersion")
    if (isLoggedIn && isAppUpdated) {
      Logout(setIsloggingOut)
    }
  }, [])

  //start serverManger
  useEffect(() => {
    if (token) {
      serverHandler.startService(token)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isSetUpDone && token) {
      //make request to server to update data in indexDB 
      updateData(setIsSyncing,setChats)
    }
  }, [isLoggedIn])

  //fetching chats from indexDB
  useEffect(() => {
    if (isSetUpDone && isLoggedIn) {
      (
        async () => {
          await fetchChatsFromIndexDB(setChats)
        }
      )();
    }
  }, [isLoggedIn, isSetUpDone])


  //globalData
  const globalData = {
    baseURL,
    socketId, socket: socketRef.current,
    isLoggedIn, setIsLoggedIn,
    token, setToken,
    profile, setProfile,
    currentConversationUserDetail, setCurrentConversationUserDetail,

    newMessage, setNewMessage,
    onlineUsers, setOnlineUsers,
    isLoggingOut, setIsloggingOut,

    chats, setChats, isSyncing,
    isSetUpDone, setIsSetUpDone,
    setCurrentChatID
  }

  //socket maintenance
  useEffect(() => {
    if (isLoggedIn) {
      const socket = io(baseURL)
      socketRef.current = socket;
      socket.on("id", (id) => {
        setSocketId(id)
        socket.emit("join", profile.id)
      })

      socket.on("recieveMsg", newMsg => {
        const event = new CustomEvent("receiveMessage", { detail: newMsg })
        document.dispatchEvent(event)
        setNewMessage(newMsg)
      })

      socket.on("pushNotification", (notification) => alert(notification))

      socket.on("activeUsers", (activeUsers) => {
        setOnlineUsers(activeUsers)
      })
    }
  }, [isLoggedIn])

  return (
    <AppContext.Provider value={globalData}>
      <App />
    </AppContext.Provider>
  )
}

root.render(
  <Application />
);


// service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => {
      console.log("serviceWorker has been registered successfully")
    })
    .catch(() => {
      console.log("serviceWorker not  registered")
    })
}