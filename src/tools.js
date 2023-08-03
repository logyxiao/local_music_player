// 生成随机数
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function $(selector) {
  return document.querySelector(selector);
}