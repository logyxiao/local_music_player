const lyricStr = `[00:01.000]歌曲: 繁华
[00:02.000]原唱: 董贞
[00:04.000]翻唱: 使用AI基于神里绫华的语音训练结果
[00:06.000]借物模型: 米哈游
[00:08.000]借物动作: 姬儿猫
[00:10.000]本视频制作: 夜玉米
[00:21.829]遇见你的眉眼
[00:26.695]如清风明月
[00:29.511]在似曾相识的凡世间
[00:34.141]顾盼流连
[00:38.236]如时光搁浅
[00:41.308]是重逢亦如初见
[00:47.196]缠绵缱绻
[00:50.269]有你的思念
[00:53.608]温暖在我掌心蔓延
[00:59.239]无涯荒野
[01:02.311]谁忘了时间
[01:05.639]一半青涩一半纯真
[01:11.783]数着年月只为花开那一面
[01:20.231]就算来来回回错过又擦肩
[01:26.375]你的喜悲忧乐我全都预见
[01:32.007]三千繁花只为你一人留恋
`




var doms = {
    audio: audio,
    ul: document.getElementById('lyc-content'),
    container: document.querySelector(".lyric-wrapper"),
};


const lyrTimes = getLyrTimes(lyricStr)
const lrcArr = generateLrc(lyricStr); // eg: [{times: 2, words: "第一句歌词"}]

//dom 元素
const playBtn = document.querySelector('.icon-bofang')
const zanTingBtn = document.querySelector('.icon-zanting1')
const previousBtn = document.querySelector('.previous')
const nextBtn = document.querySelector('.next')
const playerProgress = document.querySelector('.player-progress')
const timeStr = document.querySelector('.time')
const playDurationBar = document.querySelector('.play-duration')
const soundDuration = document.querySelector('.sound-duration')
const soundProgress = document.querySelector('.sound-progress')
const round = document.querySelector('.round')
const playerProgressBar = document.querySelector('.player-progress-bar')
const soundProgressBar = document.querySelector('.sound-progress-bar')
const musicImg = document.querySelector('.music-img')
const musician = document.querySelector('.musician')
const musicName = document.querySelector('.name')
// 歌词滚动wrapper
const lycContent = document.getElementById('lyc-content')
const lyricWrapper = document.querySelector('.lyric-wrapper')
const lycShow = document.querySelector('.icon-geciweidianji')
const musicInfo = document.querySelector('.music-info')
const infoLeft = document.querySelector('.info-left')
const lyricMask = document.querySelector('.lyric-mask')

let showLycFlag = true

//变量 
let duration, nowPlayIndex = 0


// 添加滚动事件
audio.addEventListener('timeupdate', function () {
    lycSlide()
})

let nowIndex = 0
// 歌词正常滚动
function lycSlide() {
    let index = getFirstGtIndex(lyrTimes, audio.currentTime - lycTimeDiff) - 1

    if (index == - 2) {
        return
    }


    if (lrcArr[index].words.length > 15) {
        lycContent.style.top = index * -lycFontHeight + 80 + 'px';
    } else {
        lycContent.style.top = index * -lycFontHeight + 120 + 'px';
    }

    [...lycContent.children].forEach(item => {
        item.className = ''
        item.style.color = lyricColor
        item.style.fontSize = lyricColorFontSize
    })
    lycContent.children[index].className = 'active'
    const activeClass = $('.active')
    activeClass.style.color = lyricColorActive
    activeClass.style.fontSize = lyricColorFontSizeActive
}



// 播放音乐
function playMusic() {
    audio.play();
    vudio.dance();
    audio2.play();
    // audio2.volume = 0
    vudio2.dance();
    isPlay = true
    controller.style.display = 'none'
    playBtn.style.display = 'none'
    zanTingBtn.style.display = 'block'
}

// 暂停音乐
function pauseMusic() {
    audio.pause()
    playBtn.style.display = 'block'
    zanTingBtn.style.display = 'none'
}



// 显示歌词
lycShow.addEventListener('click', function () {
    if (!showLycFlag) {
        musicInfo.style.display = 'block'
        lyricMask.style.display = 'block'
        infoLeft.style.width = '100%'
        showLycFlag = true


    } else {
        musicInfo.style.display = 'flex'
        lyricMask.style.display = 'none'
        infoLeft.style.width = '40%'
        showLycFlag = false

    }
})




// 点击声音条更改声音大小
soundDuration.addEventListener('click', function (e) {
    audio.volume = e.offsetX / this.offsetWidth
    soundProgress.style.width = e.offsetX / this.offsetWidth * 100 + '%'
})

// 声音拖动
round.addEventListener('mousedown', function () {
    let soundBarLength = soundProgressBar.offsetWidth

    // 鼠标移动
    document.onmousemove = function (ev) {
        let myEvent = ev || event
        let disX = myEvent.clientX - soundProgressBar.getBoundingClientRect().left
        if (disX > soundBarLength) {
            disX = soundBarLength
        } else if (disX == 0) {
            disX = 0
        }
        soundProgress.style.width = disX / soundBarLength * 100 + '%'
        audio.volume = disX / soundBarLength
    }

    // 鼠标抬起
    document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
    }
})


