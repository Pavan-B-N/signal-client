const dbName = "signal";
let version = 1;

function createObjectStore(objectstoreNames, keypaths) {
    const promise = new Promise((resolve, reject) => {
        let flag = false;
        const request = indexedDB.open(dbName, version);
        request.onerror = (e) => {
            reject({ state: "failed", reason: "cannot open database" })
        }
        //onupgradeneeded used to create , delete db
        //upgraded will be called when we change the version
        request.onupgradeneeded = (e) => {
            flag = true;
            const db = e.target.result;
            objectstoreNames.map((objectstoreName, index) => {
                if (!db.objectStoreNames.contains(objectstoreName)) {
                    const store = db.createObjectStore(objectstoreName, {
                        autoIncrement: false,
                        keypath: keypaths[index],
                    })

                    // store.createIndex()
                    resolve({ state: "success", store })
                } else {
                    reject({ state: "failed", reason: "object store exists" })
                }
            })
        }
        setTimeout(() => {
            if (!flag) {
                version++;
                createCollections()
                console.log("Error while creating collections")
                // reject({ state: "failed", reason: "change version" })
            }
        }, 500)
    })

    return promise;
};

function createCollections() {
    const promise=new Promise(async (resolve,reject)=>{
        if (!localStorage.getItem("indexDBActive")) {
            await createObjectStore(["chats", "users", "messages","credentials"], ["_id", "_id", "chatId","credentialType"]);
            localStorage.setItem("indexDBActive", true)
        }
        resolve(true)
    })
    return promise;

}


function openObjectStore(objectstoreName, mode) {
    const promise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onsuccess = (e) => {
            const db = e.target.result;
            try {
                var transaction = db.transaction(objectstoreName, mode);//readwrite
            } catch (err) {
                //error due to objectStore doesn't exists
                return reject({ state: "failed", reason: "cannot open object store", store: null })
            }
            const store = transaction.objectStore(objectstoreName);
            resolve({ state: "success", store, transaction });
        }
        request.onerror = (e) => {
            console.log(e);
            alert("err")
        }
    })
    return promise;
}

function getAll(objectstoreName) {
    const promise = new Promise(async (resolve, reject) => {
        const data = [];
        const { store, transaction } = await openObjectStore(objectstoreName, "readonly");
        const cursorRequest = store.openCursor()
        cursorRequest.onsuccess = (e) => {
            let cursor = e.target.result;

            if (cursor) {
                data.push(cursor.value)
                cursor.continue();
            } else {

                transaction.oncomplete = function () {
                    if (data.length == 0) {
                        reject("No data")
                    } else {
                        resolve(data)
                    }
                };
            }
        }
    })
    return promise;
}

 function put(objectstoreName, data, keypath) {
    const promise = new Promise(async(resolve, reject) => {
        const { store } = await openObjectStore(objectstoreName, "readwrite");
        const query = store.put(data, data._id || keypath || "NoKey")
        query.onsuccess = (e) => {
            resolve(e.target.result)
        }
        query.onerror = (e) => {
            reject(e)
        }
    })
    return promise;
}
function getById(objectstoreName, id) {
    const promise = new Promise(async (resolve, reject) => {
        const { store } = await openObjectStore(objectstoreName, "readonly");
        const query = store.get(id)
        query.onsuccess = (e) => {
            if (e.target.result) {
                resolve(e.target.result)
            } else {
                reject({status:404,reason:"Data not found"})
            }
        }
        query.onerror = (e) => {
            reject("error")
        }
    })
    return promise
}

function deleteDatabase() {
    const promise = new Promise(async (resolve, reject) => {
        var deleteRequest = indexedDB.deleteDatabase('signal');

        deleteRequest.onsuccess = function () {
            localStorage.removeItem("indexDBActive")
            resolve(true)
        };  

        deleteRequest.onerror = function (err) {
            reject(err)
        };
    })
    return promise;
}


export { createCollections, getAll, getById, put, deleteDatabase }