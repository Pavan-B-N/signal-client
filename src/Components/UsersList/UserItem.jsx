import { Avatar, Chip, Typography } from '@mui/material'
import React, { useContext, useState} from 'react'
import client from '../../Axios'
import AppContext from '../../AppContext'
import {useNavigate} from "react-router-dom"

function UserItem(props) {
    const { setCurrentConversationUserDetail, token } = useContext(AppContext)
    const { _id, name, profilePicture } = props.user

    //friends
    const [friends,setFriends]=useState([])
    const isFriend = isMyFriend()
    const navigate = useNavigate()
    function createOrOpenConversation() {
        //if friends open chat else create and open chat
        if (isFriend) {
            openConversation()
        } else {
            createAndOpenConversation()
        }
    }
    async function createAndOpenConversation() {
        try {
            const data = {
                type: "single",
                memberId: _id
            }
            const res = await client.post("/chat/createSingleChat", data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            setCurrentConversationUserDetail({ name, profilePicture })
            navigate(`/conversations/${res.data._id}`)
        } catch (err) {
            alert(err)
        }
    }
    function openConversation() {
        setCurrentConversationUserDetail({ name, profilePicture })
        navigate(`/conversations/${getChatId()}`)
    }
    function isMyFriend() {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].member === _id) {
                return true;
            }
        }
        return false;
    }
    function getChatId() {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].member === _id) {
                return friends[i].chatId;
            }
        }
    }
    return (
        <>
            <div className="chat-item" onClick={createOrOpenConversation} >
                <Avatar sx={{ width: 42, height: 42 }} className='avatar' src={profilePicture} />
                <div>
                    <Typography variant='subtitle1' className='chat-item-name'>{name}</Typography>
                    {isFriend && <Chip color='success' size='small' label="friends" sx={{ height: "18px" }} />}
                </div>
            </div>
        </>
    )
}

export default UserItem