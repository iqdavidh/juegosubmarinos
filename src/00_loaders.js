function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });

        image.src = url;
    })
}




//cargar imagenes ************************************************

(function () {

    function loadMar() {
        return loadImage('/img/mar1.png')
    }

    function loadBullet() {
        return loadImage('/img/Bullet.png');
    }

    function loadTanque() {
        return loadImage('/img/tanque.png');
    }

    function loadTanqueDestruido() {
        return loadImage('/img/tanque_destruido.png');
    }

    function loadRocket() {
        return loadImage('/img/Rocket150.png');
    }

    function loadExplosion() {
        return loadImage('/img/explosion50.png');
    }

    Promise.all([
            loadMar(), loadBullet(), loadTanque(),
            loadTanqueDestruido(), loadRocket(), loadExplosion()
        ]
    ).then(([imgMar, imgBullet, imgTanque,
                imgTanqueDest, imgRocket, imgExplosion]) => {

        gameConfig.resources.imgMar = imgMar;
        gameConfig.resources.imgBullet = imgBullet;
        gameConfig.resources.imgTanque = imgTanque;
        gameConfig.resources.imgTanqueDest = imgTanqueDest;
        gameConfig.resources.imgRocket = imgRocket;
        gameConfig.resources.imgExplosion = imgExplosion;

        gameConfig.isResourcesLoaded = true;
        console.log('resources loaded');
    });
})();

