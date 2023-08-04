var bubbles = $('.bubbles');
var bubbles2 = $('.bubbles2');
var bubblesWidth = bubbles.clientWidth;
var num = bubbles.getAttribute('num');
var bubblesDuration = bubbles.getAttribute('duration');



function bubbleUp(bubblesDom) {
    bubblesDom.innerHTML = '';
    for (var i = 0; i < num; i++) {
        var bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('bubble');
        bubbleDiv.style.cssText = `
        transform: translate(${bubblesWidth * Math.random()}px, 0) scale(${5 * Math.random()});
        animation: up ${bubblesDuration * Math.random() + 16}s ease-in-out;
        `
        bubblesDom.appendChild(bubbleDiv);
    };
};
bubbleUp(bubbles);
setTimeout(() => {
    bubbleUp(bubbles2);
}, 6000);
setInterval(() => {
    bubbleUp(bubbles);
    setTimeout(() => {
        bubbleUp(bubbles2);
    }, 6000);
}, bubblesDuration * 1000);