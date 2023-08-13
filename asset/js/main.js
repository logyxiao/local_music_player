

var prettify = false;
var canvas = $('#canvas');
var audio = $('#audio');


var vudio = new Vudio(audio, canvas, {
    effect: defaultEffect,
    accuracy: 128,
    width: 800,
    height: 800,
    circlebar: {
        circleRadius: 200,
        fadeSide: false,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: '../asset/img/o_1.png',
        color: canvas2Colors,
        particleColor: particleColor,
        verticalAlign: 'bottom'

    },
    circlewave: {
        circleRadius: 200,
        fadeSide: true,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: '../asset/img/o_2.png',
        color: canvas2Colors,
        particleColor: particleColor,
        verticalAlign: 'bottom'
    },
    waveform: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom'

    },
    lighting: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom'
    },
    wavy: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'

    },
});

// 底部渲染
var canvas2 = $('#canvas2');
var audio2 = $('#audio2');
var vudio2 = new Vudio(audio2, canvas2, {
    effect: types[defaultEffect2],
    accuracy: 1024,
    width: 800,
    height: 800,
    circlebar: {
        circleRadius: 200,
        fadeSide: false,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: './demo_src/o_1.png',
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'
    },
    circlewave: {
        circleRadius: 200,
        fadeSide: true,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: '../asset/img/o_2.png',
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'

    },
    waveform: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom'

    },
    lighting: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'

    },
    wavy: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'

    },
    bar: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: canvas2Colors,
        verticalAlign: 'bottom',
        horizontalAlign: 'center'

    },
});


audio.src = mp3Src;
audio2.src = mp3Src;


function changeType(index) {
    canvas.style = canvas1Style
    canvas2.style = canvas2Style
    for (let prop in canvas2Style) {
        canvas2.style[prop] = canvas2Style[prop];
    }

    vudio.setOption({
        effect: types[index]
    });
}

function changePosV(type) {
    var option = {
        verticalAlign: type,
        fadeSide: true
    };
    vudio.setOption({
        waveform: option,
        lighting: option,
    });
}
function changePosH(type) {
    var option = {
        horizontalAlign: type,
        fadeSide: true
    };
    vudio.setOption({
        waveform: option,
        lighting: option,
    });
}
function prettifyWaveform() {
    vudio.setOption({
        waveform: {
            prettify: prettify
        },
        circlewave: {
            prettify: prettify
        },
        circlebar: {
            prettify: prettify
        },
    });
    prettify = !prettify;
}

let isPlay = false

const controller = $('.controller')

const stopMusic = () => {
    audio.pause();
    audio2.pause();
    isPlay = false
    controller.style.display = 'block'
}




// 添加键盘事件监听器
document.addEventListener("keydown", function (event) {
    // 获取按下的键的键码
    var keyCode = event.keyCode || event.which;
    if (keyCode === 32) {
        if (!isPlay) {
            playMusic()
        } else {
            stopMusic()
        }
    } else if (keyCode === 37) {
        audio.currentTime -= 5
    } else if (keyCode === 39) {
        audio.currentTime += 5
    }

});

const main = () => {
    changeFont(defaultFontFamily)
    vudio.dance();
    vudio2.dance();
    changeType(defaultEffect);
}

main()