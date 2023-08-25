import client from "../../Axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Alert, Button, CircularProgress, TextField, Typography } from "@mui/material";
import LinkButton from "../../Widgets/LinkButton";
import "./Auth.css"

import Header from "../../Components/Header/Header";

//global contex
import { useContext } from "react";
import AppContext from "../../AppContext";

import { useNavigate } from "react-router-dom";
function Auth() {
    const navigate=useNavigate()
    //global context
    const { setIsLoggedIn, setProfile, setToken} = useContext(AppContext)

    const [signup, setSignup] = useState(false);

    //control attributes
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    //control error
    const [isAuthError, setIsAuthError] = useState(false);
    const [errorReason, setErrorReason] = useState(null)

    //control loading btn
    const [isLoading, setIsLoading] = useState(false)
    const [isBtnDisabled, setIsBtnDisabled] = useState(true)

    async function Authenticate() {
        if (signup) {
            CreateAccount()
        } else {
            LoginToAccount()
        }
    }
    async function CreateAccount() {
        const data = { email, password, name, confirmPassword }
        setIsAuthError(false)
        setIsBtnDisabled(true)
        setIsLoading(true)
        try {
            var res = await client.post("/auth/signup", data)
            navigate("/verifyAccount")
        } catch (err) {
            setIsAuthError(true)
            console.log(err)
            setErrorReason(err?.response?.data || err.message);
        }
        setIsBtnDisabled(false)
        setIsLoading(false)
    }
    async function LoginToAccount() {
        const data = { email, password }
        setIsAuthError(false)
        setIsBtnDisabled(true)
        setIsLoading(true)
        try {
            var res = await client.post("/auth/login", data)
            setProfile(res.data.user)
            setToken(res.data.token)
            setIsLoggedIn(true)
            localStorage.setItem("token",JSON.stringify(res.data.token))
            localStorage.setItem("profile",JSON.stringify(res.data.user))
            localStorage.setItem("loggedTime",Date.now())
            localStorage.setItem("appVersion",process.env.REACT_APP_VERSION)

        } catch (err) {
            setIsAuthError(true)
            console.log(err)
            setErrorReason(err?.response?.data || err.message);
        }
        setIsBtnDisabled(false)
        setIsLoading(false)
    }
    useEffect(() => {
        if (email !== "" && password !== "" && password?.length >= 8) {
            return setIsBtnDisabled(false)
        }
        setIsBtnDisabled(true)
    }, [name, email, password])

    const textFieldStyle = {
        m: "5px"
    }
    return (
        <>
            <Header />
            <div className='auth-container'>
                <div className="auth-template">
                    <Typography variant="h3" className="auth-app-title">Signal</Typography>
                    <Typography variant="h5" className="app-desc">Chat With Your Friends And Build Connection</Typography>
                </div>
                <div className="auth-form-container">
                    {
                        isAuthError && <Alert sx={{ marginBottom: "10px" }} severity="error">{errorReason}</Alert>
                    }
                    {signup && <TextField variant="outlined" label="Name" sx={textFieldStyle} onChange={(e) => setName(e.target.value)} value={name} />}
                    <TextField variant="outlined" label="Email" type="email" sx={textFieldStyle} onChange={(e) => setEmail(e.target.value)} value={email} />
                    <TextField variant="outlined" label="Password" type="password" sx={textFieldStyle} onChange={(e) => setPassword(e.target.value)} value={password} />
                    {signup && <TextField variant="outlined" label="Confirm Password" type="Password" sx={textFieldStyle} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />}

                    <Button variant="contained" color="success" sx={textFieldStyle} /*disabled={isBtnDisabled} */onClick={Authenticate}>
                        {isLoading ? <CircularProgress className="CircularProgress" /> :
                            (signup ? "Signup" : "Login")
                        }

                    </Button>
                    {
                        signup ?
                            <div className="auth-switcher-text-container">
                                <Typography>Already had Account ?</Typography>
                                <LinkButton onClick={() => setSignup(false)}>Login</LinkButton>
                            </div>
                            :
                            <div className="auth-switcher-text-container">
                                <Typography>Don't have Account ?</Typography>
                                <LinkButton onClick={() => setSignup(true)}>Signup</LinkButton>
                            </div>
                    }
                    <Link to={"/verifyAccount"} className="ReactLink">Verify Account</Link>
                </div>
            </div>
        </>
    )
}

export default Auth
