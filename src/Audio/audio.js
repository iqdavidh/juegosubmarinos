const gameAudio = (function () {

    let _instance = null;


    function init() {

        const sounds = {
            "disparo": {
                url: "sonido/disparo.mp3"
            },
            "explosion": {
                url: "sonido/explosion.wav"
            },
            "main": {
                url: "sonido/main.mp3",
                duracion: 197,
                volume:0.6
            },
        };

        function loadSound(name) {
            var sound = sounds[name];

            var url = sound.url;
            var buffer = sound.buffer;

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = function () {
                soundContext.decodeAudioData(request.response, function (newBuffer) {
                    sound.buffer = newBuffer;
                });
            };

            request.send();
        }

        for (var key in sounds) {
            loadSound(key);
        }

        var soundContext = new AudioContext();


        function playSound(name) {
            var sound = sounds[name];
            var soundVolume = sounds[name].volume || 1;

            var buffer = sound.buffer;
            if (buffer) {
                var source = soundContext.createBufferSource();
                source.buffer = buffer;

                var volume = soundContext.createGain();

                volume.gain.value = soundVolume;

                volume.connect(soundContext.destination);
                source.connect(volume);
                source.start(0);
            }
        }


        let playBG = () => {
            playSound('main', 0.6);
        };

        let idSoundBG = null;
        return {
            load:()=>{
              return true;
            },
            startBG: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('main');
                idSoundBG = setInterval(playBG, sounds.main.duracion * 1000)
            },
            stopBG: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                clearInterval(idSoundBG);
            },
            lanzamiento: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('disparo');
            },
            explosion:()=>{
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('explosion')
            }
        };
    }

    return {
        getInstance: () => {
            if (_instance === null) {
                _instance = init();
            }

            return _instance;
        }
    }

})();


gameAudio.getInstance().load();
