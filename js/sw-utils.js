
//Guardar en el cache dinámico
function actualizarCacheDinamico(dynamicCache, req, res){

    if (res.ok){
        //utilizar la data - valores
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {
        return res;
    }
}