

const getLinearGradient = (gradientArray) => {
    //  如果gradientArray是数组
    if (Array.isArray(gradientArray[0])) {
        gradientString = gradientArray.map(([percentage, color]) => `${color} ${percentage * 100}%`).join(', ');

    } else {
        gradientString = gradientArray.map((color) => `${color}`)

    }

    return `linear-gradient(${gradientString})`;
}

function renderButtons() {

    var container = document.getElementById("colors-select");

    for (var i = 0; i < colors.length; i++) {
        var button = document.createElement("button");
        button.className = "color " + `color-${i + 1}`
        button.style.backgroundImage = getLinearGradient(colors[i])
        button.addEventListener("click", changeColor.bind(null, i));
        container.appendChild(button);
    }
}

function changeColor(index) {
    vudio.setOption({
        waveform: {
            color: colors[index]
        },
        circlewave: {
            color: colors[index]
        },
        circlebar: {
            color: colors[index]
        },
        lighting: {
            color: colors[index]
        }
    });
}
renderButtons();
