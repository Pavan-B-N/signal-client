import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from "./Pages/Home/Home"
import Auth from "./Pages/Auth/Auth"
import Chat from "./Pages/Chat/Chat"
import VerifyAccount from "./Pages/VerifyAccount/VerifyAccount"
import { useContext, useState } from "react"
import AppContext from "./AppContext"
import CreateConversation from "./Pages/CreateConversation/CreateConversation"
import { CircularProgress, Dialog, DialogTitle } from "@mui/material"
import SetUp from "./Pages/SetUp/SetUp"

// import {deleteDatabase} from "./IndexedBDManagement"
function LagoutDialog({ open }) {
  return (
    <Dialog
      open={open}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", padding: "20px" }}>
        <CircularProgress sx={{ marginRight: "12px" }} />
        Logging out ...</DialogTitle>
    </Dialog>
  )
}
function App() {
  //global context
  const { isLoggedIn, isLoggingOut, isSettingUp, isSetUpDone } = useContext(AppContext)
  return (
    <>

      <BrowserRouter>
        <LagoutDialog open={isLoggingOut} />
        {
          !isLoggedIn &&
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/verifyAccount" exact element={<VerifyAccount />} />
            {/* while logging in its accessible */}
            <Route path="/*" element={<Auth />} />
          </Routes>
        }
        {
          isLoggedIn &&

          (
            !isSetUpDone ?
              <Routes>
                <Route path="/setUp" exact element={<SetUp />} />
                <Route path="/*" exact element={<SetUp />} />
              </Routes>
              :
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/createConversation" exact element={<CreateConversation />} />
                <Route path="/conversations/:cid" exact element={<Chat />} />
              </Routes>
          )



        }

      </BrowserRouter>
    </>
  )
}

export default App
