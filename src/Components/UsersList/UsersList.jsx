import "./UsersList.css"

import { CircularProgress, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'

import UserItem from "./UserItem"
import { fetchAllUsers } from "../../DataRequests"
function UsersList() {
  const { profile } = useContext(AppContext)
  const [users, setUsers] = useState([])

  const [isLoading, setIsloading] = useState(false)
  const [isFailed, setISFailed] = useState({ status: false, reason: "" })

  useEffect(() => {
    if(profile){
      fetchAllUsers(setIsloading, setISFailed, setUsers,profile)
    }
  }, [profile])
  return (
    <div className="users-list-container">

      {
        users.length === 0 ?
          <div className="no-users">
              <Typography variant="h6">
                {isFailed.status ? isFailed.reason : "No Conversations"}
              </Typography>
          </div> :
            users.map(user => {
              if (user._id !== profile.id) {
                return <UserItem user={user} key={user._id} />
              }
            })
      }

    </div>
  )
}

export default UsersList
