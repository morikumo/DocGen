document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("theme-button")
  const list = document.getElementById("theme")
  
  if (button && list) {
    button.addEventListener("click", () => {
      list.classList.toggle("hidden")
    })
  }
})

// Sélectionner les éléments du DOM
const rangeSlider = document.getElementById('range') as HTMLInputElement;
const rangeValue = document.getElementById('rangeValue') as HTMLSpanElement;

// S'assurer que les éléments sont bien présents
if (rangeSlider && rangeValue) {
  // Fonction qui met à jour la valeur affichée du slider
  const updateRangeValue = (): void => {
    console.log(`okayyyy : ${typeof rangeSlider.value}`);
    rangeValue.textContent = rangeSlider.value;
  };
  
  // Met à jour la valeur à chaque changement de slider
  rangeSlider.addEventListener('input', updateRangeValue);
  
  // Initialiser la valeur dès le chargement de la page
  updateRangeValue();
}
