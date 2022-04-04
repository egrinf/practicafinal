//importar sw-utils.js
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

//el contenido del app shell
const APP_SHELL = [
    './',
    './index.html',
    './css/style.css',
    './img/favicon.ico',
    './img/avatars/spiderman.jpg',
    './img/avatars/hulk.jpg',
    './img/avatars/ironman.jpg',
    './img/avatars/thor.jpg',
    './img/avatars/wolverine.jpg',
    './js/app.js'
];

//el contenido del app shell inmutable
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://kit.fontawesome.com/a3455e2a7c.js',
    './css/animate.css',
    './js/libs/jquery.js'
];

//Cuando se instale el service worker
self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll( APP_SHELL);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll( APP_SHELL_INMUTABLE);
    });

    e.waitUntil( Promise.all([cacheStatic,cacheInmutable]));
});

//Cuando se active el service worker
self.addEventListener('activate', e => {

    //eliminar el cache anterior
    const respuesta = caches.keys().then( keys => {
        //recorrrer los caches
        keys.forEach(key => {
            if(key != STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

            if(key != DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});


//recursos en cache y si no en internet
self.addEventListener('fetch', e => {

    const respuesta = caches.match( e.request).then(res => {
        //si esta en el cache
        if(res){
            return res;
        } else {
            //console.log(e.request.url);
            //subir en el cache dynamic
            return fetch(e.request).then(newRes => {
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            })
        }
    });    

    e.respondWith(respuesta);
});
