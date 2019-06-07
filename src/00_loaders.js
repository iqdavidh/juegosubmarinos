
function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });

        image.src = url;
    })
}



function loadImages(){
    return loadImage('/img/mar1.png')
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

    Promise.all([
            loadImages()
        ]
    ).then(([imgMar]) => {
        callback(imgMar);
        gameConfig.isResourcesLoaded = true;
    });

}