//  常用设置
const bgColor = '#f0a1a8'
//   粒子颜色
const particleColor = '#f0c9cf'
const canvas1Colors = ['rgba(192, 44, 56, 0.2)', 'rgba(192, 44, 56, 1)']
const canvas2Colors = ['rgba(192, 44, 56, 0.2)', 'rgba(192, 44, 56, 0.1)']

// 播放歌曲
const mp3Src = './asset/music/4.mp3'

// 歌词
const lyricColor = '#130909'
const lyricColorActive = '#fff'
const lyricColorFontSize = '30px'
const lyricColorFontSizeActive = '40px'
const lycFontHeight = 50




// 1. 柱状 2.圆形柱状 3. 波浪 4. 圆形波浪
const types = ['waveform', 'circlebar', 'lighting', 'circlewave', 'wavy', 'bar'];
// 默认特效
const defaultEffect = 1
const defaultEffect2 = 5

// 常用字体
const fonts = [
    '印品芷兰体',
    '古刻宋',
    '百转千回-方正喵鸣体',
    '方正经黑手写简体',
    '方正瘦金书简体',
    '方正字迹-吕建德行楷简体',
    '华康少女体',
    '神雕侠侣-乾坤手书',
    '时光手札体',
    '手写字-毓秀小楷体',
    '水木清华-上首追光手写体'
]
const defaultFontFamily = '水木清华-上首追光手写体'


const body = document.querySelector('body')
const bg = $('#bg')




body.style.backgroundColor = bgColor
// bg.style.backgroundColor = bgColor
// bg.style.filter = 'blur(30px)'



const config = {

}
