var CACHE_NAME = 'Geomixer';
var OFFLINE_TILE = './offline.png';

console.log("SW startup");

self.addEventListener('install', function(event) {
  // Store the «offline tile» on startup.
  return fetchAndCache(OFFLINE_TILE)
    .then(function () {
      console.log("SW installed");
    });
});

self.addEventListener('activate', function(event) {
  console.log("SW activated");
});

//
// Intercept download of map tiles: read from cache or download.
//
self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (/\bsw=/.test(request.url)) {
    var cached = caches.match(request)
      .then(function (r) {
        if (r) {
          // console.log('Cache hit', r);
          return r;
        }
        // console.log('Cache missed', request);
        return fetchAndCache(request);
      })
      // Fallback to offline tile if never cached.
      .catch(function(e) {
        console.log('Fetch failed', e);
        return fetch(OFFLINE_TILE);
      });
    event.respondWith(cached);
  }
});

//
// Helper to fetch and store in cache.
//
function fetchAndCache(request) {
  return fetch(request)
    .then(function (response) {
		var contentType = response.headers.get('Content-Type');
		if (/\b\.pbf\b/.test(request.url) && response.status !== 200) {
			return response;
		}

          // console.log('response', response);
      return caches.open(CACHE_NAME)
        .then(function(cache) {
			// var contentType = response.headers.get('Content-Type');
          // console.log('Store in cache', request.url, response.status, contentType);
          cache.put(request, response.clone());
          return response;
        });
    });
}

//	http://prgssr.ru/development/sozdaem-service-worker.html
//	http://almet.github.io/kinto-geophotos/
