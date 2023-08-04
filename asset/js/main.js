
//  默认颜色 
const defaultColor = [
    [1, '#fff'],
    [1, '#fff'],
    [1, '#fff'],
    [1, '#fff'],
    [1, '#fff'],
]

var colors = [
    defaultColor,
    [
        [0, '#f00'],
        [0.3, '#f00'],
        [0.3, '#f90'],
        [0.7, '#f90'],
        [0.7, '#ff0'],
        [1, '#ff0']
    ],
    [
        [1, '#f00'],
        [1, '#f00'],
        [1, '#f90'],
        [1, '#f90'],
        [1, '#ff0'],
    ],
    [
        '#a3f3a7',
        '#a3f3a7'
    ],
    ['#06f', '#09f', ' #0Cf', '#0ff'],
    ['#fb6d6b', '#c10056', ' #a50053', '#51074b'],
    [
        [0, '#ff422d'],
        [0.5, '#ff422d'],
        [0.5, '#6072ff'],
        [1, '#6072ff']
    ]
];


// 1. 柱状 2.圆形柱状 3. 波浪 4. 圆形波浪
const types = ['waveform', 'circlebar', 'lighting', 'circlewave'];
// 默认特效
const defaultEffect = 'circlebar'

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
        color: colors[0],
        verticalAlign: 'bottom'

    },
    circlewave: {
        circleRadius: 200,
        fadeSide: true,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: '../asset/img/o_2.png',
        color: colors[0],
        verticalAlign: 'bottom'
    },
    waveform: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: colors[0],
        verticalAlign: 'bottom'

    },
    lighting: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: colors[0],
        verticalAlign: 'bottom'

    },
});

// 底部渲染
var canvas2 = $('#canvas2');
var audio2 = $('#audio2');
var vudio2 = new Vudio(audio2, canvas2, {
    effect: types[2],
    accuracy: 128,
    width: 800,
    height: 800,
    circlebar: {
        circleRadius: 200,
        fadeSide: false,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: './demo_src/o_1.png',
        color: colors[3],
        verticalAlign: 'bottom'

    },
    circlewave: {
        circleRadius: 200,
        fadeSide: true,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: '../asset/img/o_2.png',
        color: colors[0],
        verticalAlign: 'bottom'
    },
    waveform: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: colors[0],
        verticalAlign: 'bottom'

    },
    lighting: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: colors[4],
        verticalAlign: 'bottom'

    },
});


audio.src = mp3Src;
audio2.src = mp3Src;


function changeType(index) {
    if ([1, 3].includes(index)) {
        canvas.style.position = "absolute";
        canvas.style.top = "40%";
        canvas.style.left = "0%";
        // canvas.style.marginLeft = "100px";
        canvas.style.marginTop = "-300px";
        canvas.style.width = "600px";
        canvas.style.height = "600px";

    } else {
        canvas.style.top = '45%';
        canvas.style.left = '5%';
        canvas.style.width = '90%';
        canvas.style.height = '600px';
        canvas.style.marginLeft = "0";
        canvas.style.marginTop = "0";
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



var element = document;

// 添加键盘事件监听器
element.addEventListener("keydown", function (event) {
    // 获取按下的键的键码
    var keyCode = event.keyCode || event.which;
    log(keyCode)
    // 判断是否按下的是空格键
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
    changeType(1);
}

main()