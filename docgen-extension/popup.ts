/* ******************************* SLIDER RANGES ******************************* */
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

/* ******************************* WE TOOK THE NUMBER OF PAGES AND THE THEME SELECTED  ******************************* */
const dropdown = document.querySelector('.dropdown-content') as HTMLSelectElement;
const generateBtn = document.getElementById('generate') as HTMLButtonElement;
const userInput: HTMLSpanElement = document.getElementById('prompt') as HTMLSpanElement;
const sendBtn: HTMLButtonElement = document.getElementById('generate') as HTMLButtonElement;
//Recupération de la clé api via l'env
const apiKey = "1";



/* ******************************* RANDOM NUMBER OF PAGES IN THE RANGE CHOSEN BY THE USER ******************************* */
function getRandomPageCount(sliderValue: number): number {
  if (sliderValue === 1) {
    // Plage 1 à 5
    return getRandomInt(1, 5);
  } else if (sliderValue === 6) {
    // Plage 5 à 10
    return getRandomInt(5, 10);
  } else if (sliderValue === 11) {
    // Plage 10 à 15
    return getRandomInt(10, 15);
  } else {
    // Valeur hors plage, on renvoie -1 ou on gère l’erreur
    console.warn("Valeur du slider non prise en charge :", sliderValue);
    return -1;
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



/* ******************************* AI CALL FOR RESUME ******************************* */
async function sendToMistral(prompt: string, pages: number, theme: string) {
  console.log(`arguments : ${prompt} + ${pages} + ${theme}`)
  
  const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: `You will resume the text in ${pages} pages with the ${theme} theme` }, //Change the prompt with your needs
        { role: 'user', content: prompt }
      ]
    })
  });
  
  const data = await response.json();
  console.log("Réponse IA :", data.choices[0].message.content);
  return data.choices[0].message.content;
}


/* ******************************* USER INPUT ******************************* */
if (userInput && sendBtn) {
  sendBtn.addEventListener('click', () => {
    const inputValue = userInput.textContent?.trim() || ''; // on récupère le texte saisi
    if (inputValue) {
      processInput(inputValue, getRandomPageCount(parseInt(rangeSlider.value, 10)), dropdown.value); //Le prompt à envoyer
    } else {
      console.log("L'utilisateur n'a rien saisi.");
    }
  });
}



/* ******************************* RENDERING ******************************* */
function processInput(promptText: string, pages: number, theme: string) {
  // Envoie à une API
  console.log("Traitement du prompt :", promptText);
  //console.log("Réponse : ", sendToMistral(promptText, pages, theme));
  sendToMistral(promptText, pages, theme).then((inputValue) => {
    displayOutput(inputValue);
  });
}

/* ******************************* THE OUTPUT ******************************* */
function displayOutput(text: string){
  const outputContainer = document.getElementById('output-container')!;
  const outputArea = document.getElementById('output')!;
  outputArea.textContent = text;
  outputContainer.style.display = 'block';
}


/* ******************************* COPY BUTTON ********************** */
function copyToClipboard(): void {
  const output = document.getElementById('output')!;
  navigator.clipboard.writeText(output.textContent || '').then(() => {
    alert('Résumé copié dans le presse-papiers !');
  });
}


/* ********************* DOWNLOAD BUTTON **************************** */
function downloadAsTxt(): void {
  const content = document.getElementById('output')!.textContent || '';
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.txt';
  a.click();
  URL.revokeObjectURL(url);
  
}

const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const extractBtn = document.getElementById('extract-pdf-text-button') as HTMLButtonElement;


/* *************PDF EXTRACTION THROUGTH NAVIGATOR ******************/

const extract = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("Tabs trouvés:", tabs); // Affiche l'objet tabs complet
    
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      console.log("Onglet actif:", activeTab);
      
      const activeTabUrl = activeTab.url;
      console.log("URL:", activeTabUrl);
      
      if (activeTabUrl) {
        if (isPDFUrl(activeTabUrl)) {
          alert(`C'est un fichier PDF !!! URL : ${activeTabUrl}`);
          // Vous pourriez faire quelque chose avec l'URL ici
        } else {
          alert(`Ce n'est pas un fichier PDF. URL reçue : ${activeTabUrl}`);
        }
      } else {
        alert("URL indéfinie. Vérifiez les permissions dans le manifest.");
      }
    } else {
      alert("Aucun onglet actif trouvé.");
    }
  });
}

// Vérifie si l'URL est un lien vers un PDF
function isPDFUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /\.pdf(\?.*)?$/i.test(url);
}


const ytes = () => {
  console.log('yes');
}

copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadAsTxt);
extractBtn.addEventListener('click', extract);