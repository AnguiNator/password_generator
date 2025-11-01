const elementsDom = {
    slider: document.getElementById("range"),
    outputSlider: document.getElementById("outputSlider"),
    inputs: document.querySelectorAll(".checkbox"),
    strengths: document.querySelectorAll(".strength"),
    states: document.getElementById("states"),
    button: document.querySelector("button"),
    password: document.getElementById("password"),
    copy: document.getElementById("copy"),
    copyText: document.getElementById("copyText")
}

function getCheckedCount() {
    return document.querySelectorAll(".checkbox:checked").length
}

// copiar contraseña para mayor usabilidad
elementsDom.copy.addEventListener("click", async function () {
    const copyTextButton = elementsDom.password.textContent;
    try {
        await navigator.clipboard.writeText(copyTextButton);
        elementsDom.copyText.classList.remove("hidden");
        setTimeout(() => {
            elementsDom.copyText.classList.add("hidden");
        }, 2000);
    }
    catch (err) {
        alert("Password was not copied");
    }
})

elementsDom.slider.addEventListener("input", calculateStrength)

// sube la barra de color
elementsDom.slider.addEventListener("mousemove", function () {
    elementsDom.outputSlider.textContent = this.value;

    let x = ((elementsDom.slider.value - elementsDom.slider.min) / (elementsDom.slider.max - elementsDom.slider.min) * 100);
    let color = 'linear-gradient(90deg, var(--color-green200)' + x + '%, var(--color-grey850)' + x + '%)';
    this.style.background = color;
})

// calcula cuantos checkbox están activos

elementsDom.inputs.forEach((input) => {
    input.addEventListener('change', function () {
        updateTypeCharacters(input.id);
        calculateStrength();
    })
})



const strengthLevels = {
    0: { text: "", classes: [] },
    1: { text: "TOO WEAK!", classes: ["statesRed"] },
    2: { text: "WEAK", classes: ["statesOrange", "statesOrange"] },
    3: { text: "MEDIUM", classes: ["statesYellow", "statesYellow", "statesYellow"] },
    4: { text: "STRONG", classes: ["statesGreen", "statesGreen", "statesGreen", "statesGreen"] }
}

function updatestrengthUi(count) {
    const update = strengthLevels[count];
    elementsDom.states.textContent = update.text;

    // Reset el nivel de la contraseña
    const allColorClasses = ["statesRed", "statesOrange", "statesYellow", "statesGreen"];
    elementsDom.strengths.forEach((strength) => {
        strength.classList.remove(...allColorClasses);
    })

    //aplicar cambios a los div correspondientes para ver el nivel del password
    update.classes.forEach((clase, indice) => {
        elementsDom.strengths[indice].classList.add(clase);
    })
}

const typeCharacters = [];

function updateTypeCharacters(rango) {

    if (typeCharacters.includes(rango)) {
        const indice = typeCharacters.findIndex(index => index === rango)
        typeCharacters.splice(indice, 1);

    } else {
        typeCharacters.push(rango)

    }
}


elementsDom.button.addEventListener("click", generationRanges)


function generationRanges() {
    const rangos = [];
    const rangosDisponibles = {
        uppercase: { min: 65, max: 90 },
        lowercase: { min: 97, max: 122 },
        numbers: { min: 48, max: 57 },
        symbols: [{ min: 33, max: 47 }, { min: 58, max: 64 }, { min: 91, max: 96 }, { min: 123, max: 126 }]
    }

    typeCharacters.forEach((character) => {
        rangos.push(rangosDisponibles[character])
    })

    if (rangos.length > 0) {
        randomNumber(rangos);
    }
}


function randomNumber(rangos) {

    let passwordArray = [];

    const characterLength = elementsDom.slider.value;

    for (let i = 0; i < characterLength; i++) {
        const rangoSeleccionado = selectRandomRange(rangos);
        const numeroAleatorio = Math.floor(Math.random() * (rangoSeleccionado.max - rangoSeleccionado.min + 1) + rangoSeleccionado.min);
        passwordArray.push(String.fromCharCode(numeroAleatorio));
    }
    elementsDom.password.textContent = passwordArray.join("");
    elementsDom.password.style.color = "white";
}

function selectRandomRange(rangos) {

    let indice = getRandomIndex(rangos);

    if (Array.isArray(indice)) {
        let indiceSymbols = getRandomIndex(indice)
        return indiceSymbols;
    } else {
        return indice;
    }
}

function getRandomIndex(rangos) {
    const indiceRangoAleatorio = Math.floor(Math.random() * rangos.length);
    return rangos[indiceRangoAleatorio]
}


function calculateStrength() {
    const lengthSlider = elementsDom.outputSlider.textContent;
    const typesCount = getCheckedCount();

    const lengthScore = (lengthSlider / 15) * 70;
    const typesScore = (typesCount / 4) * 30;
    const totalScore = Math.min(Math.floor((lengthScore + typesScore) / 25), 4);
    updatestrengthUi(totalScore)
}