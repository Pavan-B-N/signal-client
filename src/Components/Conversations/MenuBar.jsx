import { Menu, MenuItem } from "@mui/material"
import client from "../../Axios"
import { Avatar,  Typography } from '@mui/material'
import {useState} from "react"
import { useContext } from 'react'
import AppContext from "../../AppContext"
import {Logout} from "../../Handler"
function MenuBar(props) {
    const {setIsloggingOut} = useContext(AppContext)

    const [anchorEl, setAnchorEl] = useState(null)
    function handleMenu(e) {
        setAnchorEl(e.currentTarget)
    }
    return (
        <>
            <div onClick={handleMenu}>
                <Avatar src={props.profilePicture} />
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                id="menu"
                onClose={() => setAnchorEl(null)}
            >
                <div className="menu-user-detail">
                    <Typography variant='h6'>{props.name}</Typography>
                    <Typography variant='h6'>{props.email}</Typography>
                </div>
                <MenuItem onClick={()=>Logout(setIsloggingOut)}><Typography color={"red"}>Logout</Typography> </MenuItem>
            </Menu>
        </>
    )
}

export default MenuBar;