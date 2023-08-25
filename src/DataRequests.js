import client from "./Axios";
import {getById,put} from "./IndexedBDFunctions"


async function fetchUserData(userID, members, setChatDetail) {
    //get friend id
    const friendId = userID == members[0] ? members[1] : members[0];
    let res;
    try {
        res = await getById("users", friendId)
        setChatDetail(res)
    } catch (err) {
        console.log("network request")
        try {
            res = await client.get(`/user/${friendId}`)
            // console.log("user", res.data)
            put("users", res.data)
            setChatDetail(res.data)
        } catch (err) {
            alert("error with udetail")
        }
    }
}


//indexDB not implemented
async function fetchAllUsers(setIsloading,setISFailed,setUsers,profile) {
    setIsloading(true)
    setISFailed({status:false,reason:""})
    try {
      var res = await client.get("/user");
      const users=res.data.filter(obj=>obj._id!==profile.id)
      setUsers(users)
    } catch (err) {
      setISFailed({status:true,reason:err.message })
    }
    setIsloading(false)
  }


export {
    fetchUserData,//uname, email,id etc of user
    fetchAllUsers,
}