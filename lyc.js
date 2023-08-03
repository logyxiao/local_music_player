const lyricStr = `[00:00.00]Letting go
[00:00.00]原唱 : 蔡健雅
[00:00.63]制作人 : 汪苏泷/金若晨
[00:03.79]Letting go
[00:06.28]我终于舍得为你放开手
[00:10.48]因为爱你爱到我心痛
[00:15.80]但你却不懂
[00:20.25]这是一封离别信
[00:24.01]写下我该离开的原因
[00:27.58]我在你生命中扮演的角色太模糊了
[00:34.71]对我曾忽冷忽热
[00:38.14]我到底是情人还是朋友
[00:41.64]爱你是否不该太认真
[00:45.71]That’s why
[00:47.75]I'm letting go
[00:50.48]我终于舍得为你放开手
[00:54.52]因为爱你爱到我心痛
[00:59.64]但你却不懂
[01:02.07]Letting go
[01:04.60]你对一切都软弱与怠惰
[01:08.43]让人怀疑你是否爱过我 真的爱过我
[01:18.92]Letting go
[01:22.67]Letting go
[01:31.43]Letting go
[01:36.53]你是呼吸的空气
[01:40.10]脱离不了的地心引力
[01:43.29]你在我生命中 曾经是我存在的原因
[01:50.49]也许就像他们说
[01:54.13]爱情只会让人变愚蠢
[01:57.38]自作多情 爱得太天真
[02:01.43]That’s why
[02:03.74]I’m letting go
[02:06.30]我终于舍得为你放开手
[02:10.04]因为爱你爱到我心痛
[02:15.07]但你却不懂
[02:18.18]Letting go
[02:20.51]你对一切都软弱与怠惰
[02:24.03]让人怀疑你是否爱过我 真的爱过我
[02:33.43]为你再也找不到借口
[02:36.95]That’s when we should let it go
[02:43.90]That’s when we should let it go
[02:45.55]在夜深人静里想着
[02:49.20]心不安 却越沸腾
[02:52.86]我无助 我无助 好想哭 好想哭
[02:56.62]我找不到退路
[02:59.75]在夜深人静里写着
[03:03.50]心慢慢 就越变冷（心不安 却越沸腾）
[03:06.72]我不恨 我不恨 也不哭 也不哭
[03:10.45]我的眼泪 早已哭干了
[03:17.26]Coz I’m letting go
[03:20.41]我终于舍得为你放开手
[03:24.06]因为爱你爱到我心痛
[03:29.78]但你却不懂
[03:32.13]Letting go
[03:34.68]你对一切都软弱与怠惰
[03:38.60]让人怀疑你是否爱过我 真的爱过我
[03:46.31]Letting go
[03:48.75]你对一切都软弱与怠惰
[03:52.74]让人怀疑你是否爱过我
[03:58.17]That’s when we should let it go
[04:05.09]That’s when we should let it go
[04:08.60]That’s when we should let it go
[04:12.17]That’s when we should let it go`


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
const musicList = [{
    musicSrc: './asset/music/music-1.mp3',
    musicPic: './asset/music/music-1.jpg',
    musician: '汪苏泷/金若晨',
    musicName: 'Letting go'
},
{
    musicSrc: './asset/music/music-2.mp3',
    musicPic: './asset/music/music-2.jpg',
    musician: 'The Chainsmokers/Halsey/R3HAB',
    musicName: 'Closer',
},
{
    musicSrc: './asset/music/music-3.mp3',
    musicPic: './asset/music/music-3.jpg',
    musician: 'ILLENIUM,Nevve',
    musicName: 'Fractures',
},
{
    musicSrc: './asset/music/music-4.mp3',
    musicPic: './asset/music/music-4.jpg',
    musician: 'Daniel Powter',
    musicName: 'Free Loop'
}
]

// 获取歌词
let timeArr = []
let lrcArr = []
let insertLrcStr = ''
const str = lyricStr.split('\n')
str.forEach(item => {
    const splitLyc = item.split(']')
    timeArr.push(timeFormat(splitLyc[0].substr(1, splitLyc[0].length - 4)))
    lrcArr.push(splitLyc[1])
    insertLrcStr += `<li>${lrcArr[lrcArr.length - 1]}</li>`
})
lycContent.innerHTML = insertLrcStr

// 添加滚动事件
audio.addEventListener('timeupdate', function () {
    lycSlide()
})

// 歌词正常滚动
function lycSlide() {
    let index = binarySearch(timeArr, Math.floor(audio.currentTime))
    lycContent.style.top = index * -30 + 40 + 'px';
    [...lycContent.children].forEach(item => {
        item.className = ''
    })
    lycContent.children[index].className = 'active'
}
// 格式化时间
function timeFormat(timeStr) {
    if (timeStr) {
        const timeStrArr = timeStr.split(':')
        const minute = timeStrArr[0][0] == '0' ? timeStrArr[0][1] : timeStrArr[0]
        const second = timeStrArr[1][0] == '0' ? timeStrArr[1][1] : timeStrArr[1]
        return parseInt(minute) * 60 + parseInt(second)
    }
}

// 二分查找
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return left - 1
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] === target) return mid
    if (arr[mid] > target) {
        return binarySearch(arr, target, left, mid - 1)
    } else {
        return binarySearch(arr, target, mid + 1, right)
    }
}

// 处理时间显示进度条
function timeAndProgress() {
    playerProgress.style.width = audio.currentTime / audio.duration * 100 + '%'
    let time = audio.duration - audio.currentTime
    let minue = parseInt(time / 60)
    let second = parseInt(time % 60)
    let str = `${minue < 10 ? '0' + minue : minue}:${second < 10 ? '0' + second : second}`
    timeStr.innerHTML = str
    lycSlide()
}



// 播放音乐
function playMusic() {
    audio.play();
    audio2.play();
    vudio.dance();
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
// 加载完MP3需要设置时间显示与进度条监听
audio.addEventListener("canplay", function () {
    duration = audio.duration
    setInterval(function () {
        timeAndProgress()
    }, 1000)
})



// 点击进度条更改播放进度
playerProgressBar.addEventListener("click", function (e) {
    audio.currentTime = e.offsetX / this.offsetWidth * duration
    timeAndProgress()
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


