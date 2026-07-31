$(document).ready(function() {

    $("#descrp").on("keyup", function() {
        // this.value = this.value.replace(/[^0-9a-zA-Z:,-. \s]/g, '');
        // Naitik - changes - regex

        // change for allowing only 3000 words in description field by Utkarsh 09/03/2026
         this.value = this.value.replace(/[^0-9a-zA-Z .,\/:;\-()\s]/g, '');
       
      });
    const $micButton = $('#micButton');
    const $tooltipMenu = $('#tooltipMenu');
    const $result = $('#descrp');
    const $remainingCounter = $('.remWCounter');
    const maxWords = 3000;
    const fixedDuration = 15000; // 30 seconds
    let isListening = false;
    let speechTimeout;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        $micButton.removeClass('bi-mic-fill').addClass('bi-mic-mute');
        resetTimeout(fixedDuration);
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            finalTranscript += event.results[i][0].transcript;
        }
        updateResult(finalTranscript.trim());
        resetTimeout(fixedDuration);
    };

    recognition.onerror = function(event) {
        console.log(`Error occurred in recognition: ${event.error}`);
        clearTimeout(speechTimeout);
    };

    recognition.onend = function() {
        $micButton.removeClass('bi-mic-mute').addClass('bi-mic-fill');
        isListening = false;
        clearTimeout(speechTimeout);
    };

    $micButton.on('click', function() {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            isListening = true;
        }
    });

//    $micButton.on('mouseenter', function() {
//        const offset = $micButton.offset();
//        $tooltipMenu.css({
//            top: offset.top + $micButton.outerHeight() + 5, 
//            left: offset.left,
//            display: 'block'
//        });
//    });

    $tooltipMenu.on('mouseenter', function() {
        $(this).stop(true, true).fadeIn();
    });

//    $tooltipMenu.on('mouseleave', function() {
//        setTimeout(() => {
//            if (!$micButton.is(':hover') && !$tooltipMenu.is(':hover')) {
//                $tooltipMenu.fadeOut();
//            }
//        }, 300);
//    });

    $tooltipMenu.on('click', 'div', function() {
        const lang = $(this).data('lang');
        recognition.lang = lang;
        $tooltipMenu.fadeOut();
        if (!isListening) {
            recognition.start();
            isListening = true;
        }
    });

    function resetTimeout(duration) {
        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(function() {
            if (isListening) {
                recognition.stop();
            }
        }, duration);
    }
    function updateResult(transcript) {
        const words = transcript.split(/\s+/).filter(Boolean);
        if (words.length > maxWords) {
            const trimmedTranscript = words.slice(0, maxWords).join(' ');
            $result.val(trimmedTranscript);
            $remainingCounter.text(0);
        } else {
            $result.val(transcript);
            $remainingCounter.text(maxWords - words.length);
        }
        sendToServer($result.val());
    }

    function sendToServer(speechText) {
        $.ajax({
            url: 'speech',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text: speechText }),
            success: function(data) {
                // Handle server response
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error:', errorThrown);
            }
        });
    }
      
      
      

    // Removed unused function sendToServer

    $("#descrp").on("input", function () {
        var text = $(this).val();
        var words = text.split(/\s+/).filter(Boolean);
        var remainingCount = maxWords - words.length;
        $remainingCounter.text(remainingCount);
    });
	
	
});
