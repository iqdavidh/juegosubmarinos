
function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });


        image.src = url;
    })
}



function loadBGMar(){
    return loadImage('/img/mar1.png')
}