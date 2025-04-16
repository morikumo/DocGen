/* SLIDER RANGES*/
// Sélectionner les éléments du DOM
const rangeSlider: HTMLInputElement = document.getElementById('range') as HTMLInputElement;
const rangeValue: HTMLSpanElement = document.getElementById('rangeValue') as HTMLSpanElement;

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

/* USER INPUT*/
const userInput: HTMLSpanElement = document.getElementById('prompt') as HTMLSpanElement;
const sendBtn: HTMLButtonElement = document.getElementById('generate') as HTMLButtonElement;

if (userInput && sendBtn) {
  sendBtn.addEventListener('click', () => {
    const inputValue = userInput.textContent?.trim() || ''; // on récupère le texte saisi

    if (inputValue) {
      processInput(inputValue); //Le prompt à envoyer
    } else {
      console.log("L'utilisateur n'a rien saisi.");
    }
  });
}

const apiKey = import.meta.env.VITE_API_KEY;

async function sendToMistral(prompt: string) {
  const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: 'You are an AI assistant who knows everything.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();
  console.log("Réponse IA :", data.choices[0].message.content);
}


function processInput(promptText: string) {
  // Envoie à une API
  console.log("Traitement du prompt :", promptText);
}