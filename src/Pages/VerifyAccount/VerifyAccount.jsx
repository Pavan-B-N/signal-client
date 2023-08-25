import { Alert, Button, CircularProgress, TextField, Typography } from "@mui/material"
import TelegramIcon from '@mui/icons-material/Telegram';
import SecurityIcon from '@mui/icons-material/Security';
import Header from "../../Components/Header/Header"
import "./VerifyAccount.css"
import { useState } from "react"
import client from "../../Axios"
import { useNavigate } from "react-router-dom";

function VerifyAccount() {

  const navigate=useNavigate()


  const [email, setEmail] = useState(null)
  const [OTP, setOTP] = useState(null)

  //control error
  const [isAuthError, setIsAuthError] = useState(false);
  const [errorReason, setErrorReason] = useState(null);

  //control loading btn
  const [isLoading, setIsLoading] = useState(false)
  async function sendOTP() {
    setIsLoading(true)
    const data = { email }
    setIsAuthError(false)
    try {
      var res = await client.post("/auth/sendOTP", data)
    } catch (err) {
      setIsAuthError(true)
      console.log(err)
      setErrorReason(err?.response?.data || err.message);
    }
    setIsLoading(false)
  }
  async function VerifyOTP() {
    setIsLoading(true)
    const data = { email, otp:OTP }
    setIsAuthError(false)
    try {
      var res = await client.post("/auth/verifyAccount", data)
      navigate("/")
    } catch (err) {
      setIsAuthError(true)
      console.log(err)
      setErrorReason(err?.response?.data || err.message);
    }
    setIsLoading(false)
  }
  return (
    <>
      <Header />
      <div className="VerifyAccount-container">
        <Typography variant="h4" className="VerifyAccount-title" sx={{ marginBottom: "30px" }}>Verify Your Account</Typography>
        {
          isAuthError && <Alert sx={{ marginBottom: "10px" }} severity="error">{errorReason}</Alert>
        }
        {isLoading && <CircularProgress sx={{m:"10px"}} color="primary" />}
        <TextField variant="outlined" fullWidth label="Email" type="email" sx={{ m: "5px" }} onChange={(e) => setEmail(e.target.value)} value={email} />
        <Button variant="contained" color="warning" startIcon={<TelegramIcon />} sx={{ m: "10px" }} onClick={sendOTP}>Send OTP</Button>
        <TextField variant="outlined" fullWidth label="OTP" sx={{ m: "5px" }} onChange={(e) => setOTP(e.target.value)} value={OTP} />
        <Button variant="contained" color="success" startIcon={<SecurityIcon />} sx={{ m: "10px" }} onClick={VerifyOTP}>Verify</Button>


      </div>
    </>
  )
}

export default VerifyAccount
