

const getLinearGradient = (gradientArray) => {
    //  如果gradientArray是数组
    if (Array.isArray(gradientArray[0])) {
        gradientString = gradientArray.map(([percentage, color]) => `${color} ${percentage * 100}%`).join(', ');

    } else {
        gradientString = gradientArray

    }

    return `linear-gradient(${gradientString})`;
}

function renderButtons(colors) {

    var container = document.getElementById("colors-select");

    for (var i = 0; i < config.length; i++) {
        var button = document.createElement("button");
        button.className = "color " + `color-${i + 1}`
        button.addEventListener("click", changeColor.bind(null, i));
        button.innerHTML = config[i].name;
        container.appendChild(button);
    }
}

function changeColor(index) {
    Theme = config[index].theme;
    let { bgColor, particleColor,
        canvas1Colors, canvas2Colors,
        mp3Src,
        defaultEffect, defaultEffect2,
        defaultFontFamily,
        canvas1Style, canvas2Style,
    } = Theme
    body.style.backgroundColor = bgColor
    lyricColor = Theme.lyricColor
    lyricColorActive = Theme.lyricColorActive
    lyricColorFontSize = Theme.lyricColorFontSize
    lyricColorFontSizeActive = Theme.lyricColorFontSizeActive
    lycFontHeight = Theme.lycFontHeight

    vudio1.setOption({
        effect: defaultEffect,
        circlebar: {
            color: canvas1Colors,
            particleColor: particleColor,

        },
        circlewave: {

            color: canvas1Colors,
            particleColor: particleColor,

        },
    });

    vudio2.setOption({
        effect: defaultEffect2,
        wavy: {

            color: canvas2Colors,
        },
        bar: {

            color: canvas2Colors,
        },
    });
    canvas.style = canvas1Style
    canvas2.style = canvas2Style

    changeFont(defaultFontFamily)

    audio.src = mp3Src;
    audio2.src = mp3Src;
}
renderButtons(canvas1Colors);
