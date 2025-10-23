const slider = document.getElementById("range");
const outputSlider = document.getElementById("outputSlider");

// Edita el valor de character length cuando el input del rango se mueve.
slider.oninput = function () {
    outputSlider.textContent = this.value;
}

// sube la barra de color 
slider.addEventListener("mousemove", function () {
    let x = ((slider.value - slider.min) / (slider.max - slider.min) * 100);
    let color = 'linear-gradient(90deg, var(--color-green200)' + x + '%, var(--color-grey850)' + x + '%)';
    slider.style.background = color;
})