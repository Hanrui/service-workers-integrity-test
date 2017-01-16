// The files we want to cache
var urlsToCache = [
  './',
  './css/index.css',
  './img/yes-no.png'
];
var CACHE_NAME = 'service-workers-integrity-test-v1';

function postMessageToWindows(msg){
  try{
    self.clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients){
      clients.forEach(function(client){
        if (client.frameType == 'top-level') {
         client.postMessage(msg);      
        }
      });
    });
  } catch(e) {
    console.log('Error happened in postMessageToWindows:', e);
  }
}

postMessageToWindows('succ:message');

// Set the callback for the install step
self.addEventListener('install', function(event){
  postMessageToWindows('succ:install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      postMessageToWindows('succ:caches:open');

      if (typeof caches.has == 'function'){
        caches.has(CACHE_NAME).then(function(){
          postMessageToWindows('succ:caches:has');
        });
      }

      return cache.addAll(urlsToCache).then(function(){
        postMessageToWindows('succ:cache:addAll');
      });
    })
    .then(function(){
      caches.delete(CACHE_NAME).then(function(){
        postMessageToWindows('succ:caches:delete');
      });
    })
  );
});

self.addEventListener('activate', function(event){
  postMessageToWindows('succ:activate');
});

self.addEventListener('fetch', function(event){
  postMessageToWindows('succ:fetch');
  event.respondWith(
    caches.match(event.request).then(function(response){
      console.log(response);
      postMessageToWindows('succ:caches:match');
      return response || fetch(event.request);
    })
  );
});
