importScripts("/precache-manifest.a3f6adf4ede15a9fc4069585a9326597.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

// workbox.core.setCacheNameDetails({prefix: "transpais-wics"});

// self.__precacheManifest = [].concat(self.__precacheManifest || []);
// workbox.precaching.suppressWarnings();
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// // workbox.routing.registerNavigationRoute("/")
// workbox.routing.registerNavigationRoute("/index.html")

// workbox.routing.registerRoute(/^https?.*/, workbox.strategies.networkFirst(), 'GET')

importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL_STATIC = [
    '/app.js',
    '/js/app.js',
    '/manifest.json',
    './src/Header.vue',
    './src/Menu.vue',
    './src/Avatar.vue',
    './src/components/Login/Grid.vue',
    './src/components/Dashboard/Grid.vue',
    '/img/logo.png',
    '/logo-api.png',
    '/img/icons/favicon.ico',
    './src/components/Dashboard/components/Chart.vue',
    '/img/icons/android-chrome-192x192.png'
];


const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Lato:400,700,900&display=swap',
    'https://unpkg.com/vue-slider',
    'https://fonts.googleapis.com/css?family=Titillium+Web'
];


self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_STATIC ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));


    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) ) ;

});


self.addEventListener( 'fetch', e => {

    let respuesta;
    console.log(e.request);
    if ( e.request.url.includes('/api') ) {

        // return respuesta????
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

    } else {

        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
                
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
                });
    
            }
    
        });

    }

    e.respondWith( respuesta );

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});

