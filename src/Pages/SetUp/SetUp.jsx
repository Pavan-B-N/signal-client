import React, { useContext, useEffect } from 'react'
import AppContext from '../../AppContext'

import { createCollections } from "../../IndexedBDFunctions"
import { fetchChatsFromServer, fetchAndStoreMessages, subscribeToPushNotification } from "../../Handler"
import loader from "../../Images/loader.gif"
function SetUp() {
    const { setIsSetUpDone, profile } = useContext(AppContext)
    useEffect(() => {
        initAllServices()
    }, [])
    async function initAllServices() {
        try {
            console.log("creating collections..")
            await createCollections()
            console.log("fetching chats...")
            const chats = await fetchChatsFromServer()
            console.log("fetching messages...")
            await fetchAndStoreMessages(chats)
            console.log("subscribing to push notification");
            //if its private window raises error
            await subscribeToPushNotification(profile.id);
            console.log("setUp Success..")
            setIsSetUpDone(true);
            localStorage.setItem("isSetUpDone", true)
        } catch (err) {
            console.log(err)
        }
    }
    const s = {
        textAlign: "center",
        backgroundColor:"black",
        height:"100vh",
        width:"100%",
        color:"white",
    }
    return (
        <>
            <div style={s}>
                <img src={loader} alt='loading' />
                <h1>Wait setting up the app</h1>
                <h1>Fetching your chats and messages</h1>
            </div>

        </>
    )
}

export default SetUp
