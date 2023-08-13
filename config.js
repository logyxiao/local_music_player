// 音频可视化
// 1. 圆形柱状 1.圆形波浪 3. 波浪 4. 柱状
const types = ['circlebar', 'circlewave', 'wavy', 'bar'];
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

let Theme = config[2].theme

let { bgColor, particleColor,
    canvas1Colors, canvas2Colors,
    mp3Src, lyricColor, lyricColorActive,
    lyricColorFontSize, lyricColorFontSizeActive,
    lycFontHeight, defaultEffect, defaultEffect2,
    defaultFontFamily,
    canvas1Style, canvas2Style,
    lycTimeDiff
} = Theme



const body = document.querySelector('body')
const bg = $('#bg')


body.style.backgroundColor = bgColor

