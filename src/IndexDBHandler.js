import { getAll, put, getById } from "./IndexedBDFunctions"
import { fireMessageUpdatedEvent } from "./Handler";
class IndexDBHandler {
    fetchChats() {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const chats = await getAll("chats");
                resolve(chats)
            } catch (err) {
                reject(err)
            }
        })
        return promise;
    }
    //fetches messages of a particular chat
    fetchMessages(chatId) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const messages = await getById("messages", chatId);
                resolve(messages)
            } catch (err) {
                if (err.status == 404) {
                    resolve([])
                } else {
                    reject(err)
                }

            }
        })
        return promise;
    }
    storeChats(chats) {
        const promise = new Promise(async (resolve, reject) => {
            for await (let chat of chats) {
                try {
                    await put("chats", chat)
                } catch (err) {
                    reject(err);
                }
            }
            resolve("successfully stored chats")
        })

        return promise;
    }
    //storing messages of a particular chat
    storeMessages(msg, keypath) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                await put("messages", msg, keypath)
            } catch (err) {
                reject(err);
            }
            resolve("successfully stored chats")
        })
        return promise;
    }
    addNewMessageToChatId(cid, msg) {
        const promise = new Promise(async (resolve, reject) => {
            const messages = await getById("messages", cid)
            const res = await put("messages", [...messages, msg], cid)
            fireMessageUpdatedEvent(cid)
            resolve(res)
        })
        return promise
    }
    storePushSubscription(ps) {
        const promise = new Promise(async (resolve, reject) => {
            const credentialType = "pushSubscription"
            await put("credentials", { pushSubscription: JSON.stringify(ps), credentialType }, credentialType)
            resolve(true)
        })
        return promise;
    }
    getPushSubscription() {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const { pushSubscription } = await getById("credentials", "pushSubscription")
                resolve(pushSubscription)
            }catch(err){
                resolve({pushSubscription:"No Data"})
            }
        })
        return promise;
    }

}
const indexDBHandler = new IndexDBHandler()
export default indexDBHandler;