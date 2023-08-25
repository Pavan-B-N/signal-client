import client from "./Axios"
import { getAll, put } from "./IndexedBDFunctions"
class ServerHandler {
    startService(token) {
        this.token = token;
    }
    getServerDetail() {
        console.log(this.token)
    }
    fetchChats() {
        const promise = new Promise(async (resolve, reject) => {
            //fetches exact user caht using token payload
            try {
                var { data } = await client.get("/chat", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.token}`
                    }
                });
                resolve(data)
            } catch (err) {
                reject(err.message);
            }


        })
        return promise;
    }
    //fetch messages of a particular chat
    fetchMessages(chatId) {
        const promise=new Promise(async(resolve,reject)=>{
            try {
                const { data } = await client.get(`/message/${chatId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.token}`
                    }
                })
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
        return promise;
    }
}
const serverHandler = new ServerHandler();
export default serverHandler;