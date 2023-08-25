/*
const static_cache = "signal_static_cache";
const assets = [
    "/",
    "/sw.js",
    "/favicon_io",
    "/static/js/bundle.js",
    "/manifest.json",
    "/logo.png",
]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(static_cache)
            .then(cache => {
                cache.addAll(assets)
                    .then(res => {
                        console.log("res", res)
                    })
                    .catch(err => console.log("error occured during caching the pwa assets"))
            })
    )
})



self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(cacheRes => {
                return cacheRes || fetch(e.request)
            })
    )
})
*/

self.addEventListener("push", e => {
    const data = e.data.json()
    console.log(data)

    const promise = self.registration.showNotification(data.name, {
        body: data.msg, icon: data.icon, vibrate: true,
        // actions: [
        //     { action: 'open', title: 'open' },
        //     { action: 'close', title: 'close' }
        // ]
    })
    caches.

    e.waitUntil(promise)
    console.log(data)
})


self.addEventListener('notificationclick', function (event) {
    clients.openWindow("/");
    event.notification.close();
    // if (event.action === "open") {
        // clients.openWindow("/")
    // }else{
    //     clients.openWindow("https://youtube.com")
    // }
});