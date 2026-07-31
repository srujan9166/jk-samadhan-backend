var currentScript = document.currentScript;
const TRANSLATION_PLUGIN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldlYl9UcmFuc2xhdGlvbl91dGlsaXR5IiwiaWF0IjoxNTE2MjM5MDIyfQ.9lQKhariTqbASWQzLXpox8wh5MAW6ZrhIgkfJyP7rhU';
const posX = currentScript.getAttribute('data-pos-x') || 950;
const posY = currentScript.getAttribute('data-pos-y')|| 925;

const TRANSLATION_PLUGIN_API_BASE_URL = 'https://translation-plugin.bhashini.co.in';


var conditionForImgTag = $('#randomVal2').text();
var imgTag = "";
if (conditionForImgTag == "") {
	imgTag = "img/bhashini_logo.png"
}else{
	imgTag = "../../img/bhashini_logo.png"
}


// Define translationCache object to store original text
var translationCache = {};

// Flag to track whether content has been translated initially
var isContentTranslated = false;

// Selected target language for translation
var selectedTargetLanguageCode = "";

// Retrieve translationCache from session storage if available
if (sessionStorage.getItem('translationCache')) {
    translationCache = JSON.parse(sessionStorage.getItem('translationCache'));
}

// var cssLink = document.createElement('link');
// cssLink.rel = 'stylesheet';
// cssLink.href = `${TRANSLATION_PLUGIN_API_BASE_URL}/website_translation_utility.css`;

// // Append link to the head
// document.head.appendChild(cssLink);

// Fetch supported translation languages
function fetchTranslationSupportedLanguages() {
    const targetLangSelectElement = document.getElementById("translate-plugin-target-language-list");
    supportedTargetLangArr = [
        { "code": "", "label": "Language" },
        { "code": "en", "label": "English" },
        { "code": "hi", "label": "Hindi (हिन्दी)"},
        { "code": "ur", "label": "Urdu (اردو)"}
        //, { "code": "as", "label": "Assamese (অসমীয়া)"},
        // { "code": "bn", "label": "Bengali (বাংলা)"},
        // { "code": "brx", "label": "Bodo (बड़ो)"},
        // { "code": "doi", "label": "Dogri (डोगरी)"},
        // { "code": "gom", "label": "Goan Konkani (गोवा कोंकणी)"},
        // { "code": "gu", "label": "Gujarati (ગુજરાતી)"},
        // { "code": "kn", "label": "Kannada (ಕನ್ನಡ)"},
        // { "code": "ks", "label": "Kashmiri (कश्मीरी)"},
        // { "code": "mai", "label": "Maithili (मैथिली)"},
        // { "code": "ml", "label": "Malayalam (മലയാളം)"},
        // { "code": "mni", "label": "Manipuri (মণিপুরী)"},
        // { "code": "mr", "label": "Marathi (मराठी)"},
        // { "code": "ne", "label": "Nepali (नेपाली)"},
        // { "code": "or", "label": "Odia (ଓଡ଼ିଆ)"},
        // { "code": "pa", "label": "Punjabi (ਪੰਜਾਬੀ)"},
        // { "code": "sa", "label": "Sanskrit (संस्कृत)"},
        // { "code": "sat", "label": "Santali (संताली)"},
        // { "code": "sd", "label": "Sindhi (سنڌي)"},
        // { "code": "ta", "label": "Tamil (தமிழ்)"},
        // { "code": "te", "label": "Telugu (తెలుగు)"}
    ]

    supportedTargetLangArr.forEach(element => {
        let option_element = document.createElement("option");
        option_element.setAttribute("class", "dont-translate");
        option_element.value = element.code;
        option_element.textContent = element.label;
        targetLangSelectElement.appendChild(option_element);
    });
}

// Function to split an array into chunks of a specific size
function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}

// Function to translate text chunks using custom API
async function translateTextChunks(chunks, target_lang) {
    try {
        const response = await fetch(`${TRANSLATION_PLUGIN_API_BASE_URL}/v1/translate-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TRANSLATION_PLUGIN_API_KEY
            },
            body: JSON.stringify({ sourceLanguage: "en", targetLanguage: target_lang, textData: chunks }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error translating text:', error);
        return [];
    }
}

// Function to recursively traverse DOM tree and get text nodes while skipping elements with "dont-translate" class
function getTextNodesToTranslate(node, textNodes = []) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        const isNumeric = /^[\d.]+$/.test(walker.currentNode.data);
        const checkl = walker.currentNode.data.split("\n").join("").trim().length;
        if (!isIgnoredNode(currentNode) && checkl && !isNumeric) {
            textNodes.push(currentNode);
        }
    }
    return textNodes;
}

function isIgnoredNode(node) {
    return (
        node.parentNode &&
        (node.parentNode.tagName === "STYLE" ||
            node.parentNode.tagName === "SCRIPT" ||
            node.parentNode.tagName === "NOSCRIPT" ||
            node.parentNode.classList.contains('dont-translate') ||
            node.parentNode.classList.contains('bhashini-skip-translation'))
    );
}


// Function to translate the text of an element
async function translateElementText(element, target_lang) {
    const textNodes = getTextNodesToTranslate(element);
    if (textNodes.length > 0) {
        const textContentArray = textNodes.map(node => node.textContent.trim());
        const translatedTexts = await translateTextChunks(textContentArray, target_lang);
        textNodes.forEach((node, index) => {
            const translatedText = translatedTexts[index].target || textContentArray[index];
            node.nodeValue = translatedText;
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Create translation popup elements
    const wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute("class", "dont-translate bhashini-skip-translation");
    wrapperDiv.setAttribute("id", "bhashini-translation");
    wrapperDiv.setAttribute("title", "Translate this page!");
    wrapperDiv.style.left = `${posX}px`;
    wrapperDiv.style.bottom = `${posY}px`;
    // wrapperDiv.innerHTML = `<select class="translate-plugin-dropdown" id="translate-plugin-target-language-list"></select><img id="cusTag" src="" alt="toggle translation popup">`
    wrapperDiv.innerHTML = `<select class="translate-plugin-dropdown" id="translate-plugin-target-language-list"></select>`

    // Append translation popup elements to body
     $('#customBhas').append(wrapperDiv);
	 $('#cusTag').attr('src', imgTag);
//    document.body.appendChild(wrapperDiv);
    // Add event listener for dropdown change
    const targetLanguageList = document.getElementById("translate-plugin-target-language-list");
    if (targetLanguageList) {
        targetLanguageList.addEventListener('change', onDropdownChange);
    }

    // Fetch supported translation languages
    fetchTranslationSupportedLanguages();

    // Create a new MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.target.innerHTML) {
                // If a new element is added, replaced, or changed, translate its text nodes
                // const targetLang = document.getElementById("translate-plugin-target-language-list").value;
                if (selectedTargetLanguageCode) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            translateElementText(node, selectedTargetLanguageCode);
                        }
                    });
                }
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
});

// Function to handle dropdown change
function onDropdownChange(event) {
    const selectedValue = event.target.value;

    // my custom code - start
    // alert(selectedValue)
    if(selectedValue ==='hi'){
        $('.logo-img').html('<img src="img/Hindi_logo.png" alt="Samadhan logo" class="JKlogo">')
        $('.footer_logo_a').html('<img class="img-fluid" src="img/Hindi_logo.png">')
        $('.logo').html('<img src="/img/Hindi_logo.png" alt="Samadhan logo">')
    }else if(selectedValue ==='ur'){
        $('.logo-img').html('<img src="img/Urdu_logo.png" alt="Samadhan logo" class="JKlogo">')
        $('.footer_logo_a').html('<img class="img-fluid" src="img/Urdu_logo.png">')
        $('.logo').html('<img src="/img/Urdu_logo.png" alt="Samadhan logo">')
    }    
    // my custom code - end

    // If English is selected, restore translations from session storage
    if (selectedValue && selectedValue === "en" && isContentTranslated) {
        // selectedTargetLanguageCode = ""
        // restoreTranslations();
        window.location.reload();
    } else if(selectedValue && selectedValue !== "en") {
        selectedTargetLanguageCode = selectedValue
        isContentTranslated = true
        // Perform translation for the selected language
        translateAllTextNodes(selectedTargetLanguageCode);
    }
}

// Function to restore translations from session storage
function restoreTranslations() {
    const textNodes = getTextNodesToTranslate(document.body);
    textNodes.forEach(node => {
        const id = node.parentNode.getAttribute('data-translation-id');
        if (id && translationCache[id]) {
            node.nodeValue = translationCache[id];
        }
    });
    fetchTranslationSupportedLanguages();
}

// Function to translate all text nodes in the document
async function translateAllTextNodes(target_lang) {
    const textNodes = getTextNodesToTranslate(document.body);
    if (textNodes.length > 0) {
        const textContentArray = textNodes.map((node, index) => {
            const id = `translation-${Date.now()}-${index}`;
            // Store original text in session storage
            translationCache[id] = node.textContent.trim();
            if (node.parentNode) {
                node.parentNode.setAttribute('data-translation-id', id);
            }
            return { text: node.textContent.trim(), id, node };
        });
        const textChunks = chunkArray(textContentArray, 75);

        // Create an array to hold promises for each chunk translation
        const promises = textChunks.map(async chunk => {
            const texts = chunk.map(({ text }) => text.trim());
            const translatedTexts = await translateTextChunks(texts, target_lang);
            chunk.forEach(({ id, node }, index) => {
                const translatedText = translatedTexts[index].target || texts[index];
                if (node.nodeValue.trim().length > 0) {
                    node.nodeValue = translatedText;
                }
            });
        });

        // Wait for all translations to complete
        await Promise.all(promises);

        const targetLangSelectElement = document.getElementById("translate-plugin-target-language-list");
        // Check if the targetLangSelectElement exists
        if (targetLangSelectElement) {
            // Loop through each option element
            Array.from(targetLangSelectElement.options).forEach(option => {
                // Check if the value is not "en", not equal to target_lang, and not an empty string
                if (option.value !== 'en' && option.value !== target_lang) {
                    option.remove();
                } else if (option.value === target_lang) {
                    // Keep the default selected option if it's the target language
                    option.selected = true;
                }
            });
        } else {
            console.error('Target language select element not found.');
        }
    }
}

// Store translationCache in session storage
sessionStorage.setItem('translationCache', JSON.stringify(translationCache));