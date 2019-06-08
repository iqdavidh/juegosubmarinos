
function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });

        image.src = url;
    })
}




function loadCanvasAndResources(callback){

    /* registrar canvas */
    if(!gameData.isCanvasLoaded){

        gameData.canvas = document.createElement('canvas');
        gameData.canvas.width = gameConfig.size;
        gameData.canvas.height = gameConfig.size;

        let container = document.getElementById('container');
        container.append(gameData.canvas);
        gameData.ctx = gameData.canvas.getContext('2d');

        gameData.isCanvasLoaded=true;
    }

    /* precargar archivos *************************** */


    function loadMar(){
        return loadImage('/img/mar1.png')
    }

    function loadBullet(){
        return loadImage( '/img/Bullet.png');
    }

    function loadTanque(){
        return loadImage( '/img/tanque.png');
    }

    function loadTanqueDestruido(){
        return loadImage( '/img/tanque_destruido.png');
    }

    function loadRocket(){
        return loadImage( '/img/Rocket.png');
    }

    function loadExplosion(){
        return loadImage( '/img/Explosion.png');
    }

    Promise.all([
            loadMar(),loadBullet(), loadTanque(),
            loadTanqueDestruido(), loadRocket(),loadExplosion()
        ]
    ).then(([imgMar, imgBullet, imgTanque,
                           imgTanqueDest, imgRocket, imgExplosion]) => {
        callback(imgMar, imgBullet, imgTanque
            , imgTanqueDest, imgRocket, imgExplosion);
        gameConfig.isResourcesLoaded = true;
    });

}