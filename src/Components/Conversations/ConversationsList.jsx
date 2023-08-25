import {  CircularProgress, Fab, Typography } from '@mui/material'
import "./ConversationsList.css"
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import AppContext from "../../AppContext"
import SearchIcon from '@mui/icons-material/Search';
import ConversationItem from './ConversationItem'
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom"

import MenuBar from './MenuBar'

function ConversationsList() {
  const { profile ,chats,isSyncing} = useContext(AppContext)


  const [isLoading, setIsloading] = useState(false)
  const [isFailed, setISFailed] = useState({ status: false, reason: "" })
  //search
  const [searchText, setSearchText] = useState("")


  return (
    <div className='conversation-main-list'>
      <div className="menu-titlebar">
        <Typography variant='h5' sx={{ m: "10px" }}>Conversations</Typography>
        <div className="menu-options">
          <MenuBar uid={profile.id} profilePicture={profile.profilePicture} email={profile.email} name={profile.name} />
        </div>
      </div>
      {
        isSyncing && <div>syncing..</div>
      }
      <div className="search-box">
        <SearchIcon />
        <input type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      </div>
      <div className="conversation-list-conatiner">
        {
          chats.length === 0 ?
            <div className="no-conversation">
              {isLoading && <CircularProgress />}
              {!isLoading &&
                <Typography variant="h6">
                  {isFailed.status ? isFailed.reason : "No Conversations"}
                </Typography>}
            </div>
            :
            chats.map(chat => {
              return <ConversationItem chat={chat} key={chat._id} />
            })
        }
      </div>

      {/* fab */}
      <Link to="/createConversation" className='fab-icon'>
        <Fab color="primary" aria-label="add" >
          <AddIcon />
        </Fab>
      </Link>
    </div>
  )
}


export default ConversationsList
