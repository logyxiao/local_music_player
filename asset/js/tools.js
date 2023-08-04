// 生成随机数
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function $(selector) {
  return document.querySelector(selector);
}

const log = console.log.bind(console);

/**
 * 获取数组中第一个大于目标值的元素索引
 * @param {number[]} nums 
 * @param {number} target
 * @returns {number}
 */
function getFirstGtIndex(nums, target) {

  let index = -1;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) {
      index = i;
      break;
    }
  }
  if (index === 0) {
    return 1
  }

  return index;
}

/**
 * 获取歌词字符串中所有时间标签 
 * @param {string} lyricStr - 歌词字符串
 * @returns {number[]} 时间标签数组,单位为秒
*/
const getLyrTimes = (lyricStr) => {
  const reg = /\[(\d{2}:\d{2}.\d{2})]/g
  const times = lyricStr.match(reg)

  return times.map(item => {
    // 解析时间标签,转换为秒
    const min = Number(item.slice(1, 3))
    const sec = Number(item.slice(4, 6))
    const ms = Number(item.slice(7, 9))
    return min * 60 + sec + ms / 100;
  }).concat([9999])
}

/**
 * 将单个时间标签解析为秒
 * @param {string} time - 时间标签字符串 
 * @returns {number} 解析后的时间秒数
*/
const getLyrTime = (time) => {
  const min = Number(time.slice(1, 3))
  const sec = Number(time.slice(4, 6))
  const ms = Number(time.slice(7, 9))
  return min * 60 + sec + ms / 100;
}

/**
 * 解析歌词字符串为数组对象格式
 * @param {string} lyricStr - 歌词字符串
 * @returns {Object[]} 解析后的歌词数组
*/
const parseLrc = (lyricStr) => {
  const reg = /\[\d{2}:\d{2}.\d{2}\]/g
  const times = lyricStr.match(reg)
  const lrcArr = lyricStr.split(reg)
  lrcArr.shift()
  const lrc = lrcArr.map((item, index) => {
    return {
      times: getLyrTime(times[index]),
      words: item
    }
  })
  return lrc
}

function generateLrc(lyricStr) {
  const lrcArr = parseLrc(lyricStr); // 歌词格式处理
  var frag = document.createDocumentFragment();
  for (let i = 0; i < lrcArr.length; i++) {
    var li = document.createElement("li");
    li.textContent = lrcArr[i].words;
    li.style.color = lyricColor
    li.style.fontSize = lyricColorActive
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
  return lrcArr.concat([{ times: 9999, words: "END" }])
}




// 切换字体函数
const changeFont = (fontName = '印品芷兰体') => {
  document.body.style.fontFamily = fontName
}


