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
  // Fonction qui met à jour la valeur affichée du slider avec la plage correspondante
  const updateRangeValue = (): void => {
    const value = parseInt(rangeSlider.value, 10); // Récupère la valeur du slider sous forme de nombre

    if (value <= 5) {
      rangeValue.textContent = '1 to 5';
    } else if (value <= 10) {
      rangeValue.textContent = '5 to 10';
    } else {
      rangeValue.textContent = '10 or +';
    }
  };
  
  // Met à jour la valeur à chaque changement de slider
  rangeSlider.addEventListener('input', updateRangeValue);
  
  // Initialiser la valeur dès le chargement de la page
  updateRangeValue();
}
