document.addEventListener("DOMContentLoaded", function() {
    var translateIdElement = document.getElementById("translate-id");
    var storageValue = localStorage.getItem("translateValue");


    
    if (storageValue && storageValue !== 'en') {
        setDefaultLanguageToHindi(storageValue);
    }

    var debounceTimeout;
    translateIdElement.addEventListener("change", function() {
        clearTimeout(debounceTimeout);
        var value = this.value;
//alert(value)
        debounceTimeout = setTimeout(function() {
            var storedValue = localStorage.getItem("translateValue") || value;

            if (value === 'en') {
                localStorage.removeItem("translateValue");
                location.reload(); // Refresh the page if 'English' is selected
            } else {
                localStorage.setItem("translateValue", value);
                initiateLazyLoading(storedValue, value);
            }

 if(value ==='hi'){
   
    $('.logo-img').html('<img src="img/Hindi_logo.png" alt="Samadhan logo" class="JKlogo">')
    $('.footer_logo_a').html('<img class="img-fluid" src="img/Hindi_logo.png">')
    $('.logo').html('<img src="/Grievance/img/Hindi_logo.png" alt="Samadhan logo">')

}else if(value ==='ur'){
    $('.logo-img').html('<img src="img/Urdu_logo.png" alt="Samadhan logo" class="JKlogo">')
    $('.footer_logo_a').html('<img class="img-fluid" src="img/Urdu_logo.png">')
    $('.logo').html('<img src="/Grievance/img/Urdu_logo.png" alt="Samadhan logo">')

}

        }, 20);
    });
});

function initiateLazyLoading(srclang, targetlang) {
    var textNodes = collectTextNodes();
    var chunkSize = 100; // Process 20 text nodes at a time
    var currentIndex = 0;

    function processChunk() {
        var chunk = textNodes.slice(currentIndex, currentIndex + chunkSize);
        var promises = chunk.map(function(node) {
            return translatePage([node.nodeValue.trim()], srclang, targetlang)
                .then(function(translations) {
                    node.nodeValue = translations[0].replace(/\./g, '');
                })
                .catch(function(e) {
                    console.error("Error translating text:", e);
                });
        });

        Promise.all(promises).then(function() {
            currentIndex += chunkSize;
            if (currentIndex < textNodes.length) {
                processChunk(); // Process the next chunk
            }
        });
    }

    processChunk(); // Start processing the first chunk
}

function collectTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];

    while (walker.nextNode()) {
        var text = walker.currentNode.nodeValue.trim();
        if (text && !['English', 'Hindi', 'Urdu', '|'].includes(text)) {
            textNodes.push(walker.currentNode);
        }
    }
    return textNodes;
}

function translatePage(textArray, srclang, targetlang) {
    var apiKey = 'U0Ij4_EsEj9mZdln51Sm9u3Pxw6BD7-ZQixH1yNRhatfm4N87wF6yxoou3ORSf-q'; // Replace with your actual API key
    var url = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
    var requestBody = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": srclang,
                        "targetLanguage": targetlang
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": textArray.map(function(text) {
                return { "source": text };
            })
        }
    };

    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestBody),
            success: function(response) {
                var translatedTexts = response.pipelineResponse.map(function(resp) {
                    return resp.output[0].target;
                });
                resolve(translatedTexts);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function setDefaultLanguageToHindi(localStorageValue) {
    var selectElement = document.getElementById('translate-id');
    if (selectElement) {
        selectElement.value = localStorageValue;
        setTimeout(function() {
            selectElement.dispatchEvent(new Event('change'));
        }, 0);
    }
}
