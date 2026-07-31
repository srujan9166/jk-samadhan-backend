self.onmessage = function(event) {
    var text = event.data[0];
    var srclang = event.data[1];
    var targetlang = event.data[2];

    translatePage([text], srclang, targetlang)
        .then(function(translations) {
            var translatedText = translations[0];
            self.postMessage({
                nodeId: event.data[3],
                translatedText: translatedText
            });
        })
        .catch(function(e) {
            self.postMessage({
                error: e
            });
        });
};

self.onmessageerror = function(event) {
    self.postMessage({
        error: event
    });
};


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