export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });


        image.src = url;
    })
}



export function loadBGMar(){
    return loadImage('./img/mar1.png')
}