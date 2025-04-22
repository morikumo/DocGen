/* ******************************* INITIALIZATION ******************************* */
const rangeSlider: HTMLInputElement = document.getElementById('range') as HTMLInputElement;
const rangeValue: HTMLSpanElement = document.getElementById('rangeValue') as HTMLSpanElement;
const dropdown = document.querySelector('.dropdown-content') as HTMLSelectElement;
const userInput: HTMLSpanElement = document.getElementById('prompt') as HTMLSpanElement;
const sendBtn: HTMLButtonElement = document.getElementById('generate') as HTMLButtonElement;
const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const langBtnEN = document.getElementById('lang-en') as HTMLButtonElement;
const langBtnFR = document.getElementById('lang-fr') as HTMLButtonElement;
let currentLang = "English";
const selectedLang = document.querySelector('input[name="language"]:checked') as HTMLInputElement;
const langValue = selectedLang ? selectedLang.value : "English";
//Notre url
let activeTabUrl: string | undefined = '';
//Recupération de la clé api via l'env
const apiKey = "a";

/* ******************************* SLIDER RANGES ******************************* */

if (rangeSlider && rangeValue) {
  const updateRangeValue = (): void => {
    const value = parseInt(rangeSlider.value, 10);

    if (value <= 5) {
      rangeValue.textContent = '1 to 5';
    } else if (value <= 10) {
      rangeValue.textContent = '5 to 10';
    } else {
      rangeValue.textContent = '10 or +';
    }
  };

  rangeSlider.addEventListener('input', updateRangeValue);

  updateRangeValue();
}

/* ******************************* RANDOM NUMBER OF PARAGRAPHES IN THE RANGE CHOSEN BY THE USER ******************************* */
function getRandomPageCount(sliderValue: number): number {
  if (sliderValue === 1) {
    return getRandomInt(1, 5);
  } else if (sliderValue === 6) {
    return getRandomInt(5, 10);
  } else if (sliderValue === 11) {
    return getRandomInt(10, 15);
  } else {
    console.warn("Valeur du slider non prise en charge :", sliderValue);
    return -1;
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ******************************* LANGUAGE CHOOSEN ******************************* */
function setActiveLang(lang: string, button: HTMLButtonElement) {
  currentLang = lang;

  const langButtons = document.querySelectorAll('#lang-container button');
  langButtons.forEach(btn => btn.classList.remove('active'));

  button.classList.add('active');

  console.log(`Langue sélectionnée: ${lang}`);
}

if (langBtnEN && langBtnFR) {
  langBtnEN.addEventListener('click', () => setActiveLang("English", langBtnEN));
  langBtnFR.addEventListener('click', () => setActiveLang("French", langBtnFR));
}


/* ******************************* AI CALL FOR RESUME ******************************* */
async function sendToMistral(prompt: string, paragraphes: number, theme: string, lang: string) {
  console.log(`arguments : ${prompt} + ${paragraphes} + ${theme} + url ${activeTabUrl}+ language ${lang}`)

  const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',// We need to change the model because it will not read pdf or i do wrong
      messages: [
        { role: 'system', content: `You will resume the text in ${paragraphes} paragraphes with the ${theme} theme about this url ${activeTabUrl}. Answer in the ${lang} language.` }, //Change the prompt with your needs
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
    if (inputValue && isPDFUrl(activeTabUrl)) {
      processInput(
        inputValue,
        getRandomPageCount(parseInt(rangeSlider.value, 10)),
        dropdown.value,
        currentLang
      ); // Le prompt à envoyer
    }
    else if (inputValue && !isPDFUrl(activeTabUrl)){
      alert("Cette page n'est pas un pdf !");
    }
    else {
      alert("L'utilisateur n'a rien saisi.");
    }
  });
}



/* ******************************* RENDERING ******************************* */
function processInput(promptText: string, paragraphes: number, theme: string, lang: string) {
  // Envoie à une API
  console.log("Traitement du prompt :", promptText);
  sendToMistral(promptText, paragraphes, theme, lang).then((inputValue) => {
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


/* *************PDF EXTRACTION THROUGTH NAVIGATOR ******************/


document.addEventListener('DOMContentLoaded', function() {
  const pdfUrlContainer = document.getElementById('url-container');
  const pdfUrlElement = document.getElementById('pdf-url');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];

      activeTabUrl = activeTab.url;

      if (activeTabUrl && isPDFUrl(activeTabUrl) && pdfUrlElement && pdfUrlContainer) {
        pdfUrlElement.textContent = activeTabUrl;
        pdfUrlContainer.style.display = 'block';
        // Vous pourriez faire quelque chose avec l'URL ici
      } else {
        if(pdfUrlContainer && pdfUrlElement){
          pdfUrlElement.textContent = "Url not a pdf"
          pdfUrlContainer.style.display = 'block';
        }
      }
    } else {
      alert("Aucun onglet actif trouvé.");
    }
  });
}
)

// Vérifie si l'URL est un lien vers un PDF
function isPDFUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /\.pdf(\?.*)?$/i.test(url);
}

copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadAsTxt);
