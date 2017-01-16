// The files we want to cache
var urlsToCache = [
  './css/index.css'
];
var CACHE_NAME = 'service-workers-integrity-test-v1';

function postMessageToWindows(msg){
  self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients){
    clients.forEach(function(client){
      if (client.frameType == 'top-level') {
       client.postMessage(msg);      
      }
    });
  });
}

postMessageToWindows('succ:message');

// Set the callback for the install step
self.addEventListener('install', function(event){
  postMessageToWindows('succ:install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      postMessageToWindows('succ:caches:open');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event){
  postMessageToWindows('succ:activate');
});

self.addEventListener('fetch', function(event){
  postMessageToWindows('succ:fetch');
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        postMessageToWindows('succ:caches:match');
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});