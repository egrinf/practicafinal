
//Guardar en el cache dinámico
function actualizaCacheDinamico(dynamicCache, req, res){

    if (res.ok) {
        //data tiene valores
        return caches.open(dynamicCache).then(cache =>{
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {
        return res;
    }
}
