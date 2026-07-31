/**
 * Template Name: NiceAdmin - v2.5.0
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

$(document).ready(function () {
  $(".skiptranslate").hide();
  $(".skiptranslate").addClass("visually-hidden");

  $(document).mouseup(function (e) {
    var container = $("#chat-bot-medium");

    // If the target of the click isn't the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
      $(".ai-chat-bot-profile_div").show();
    }
  });
});

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Sidebar toggle
   */
  if (select(".toggle-sidebar-btn")) {
    on("click", ".toggle-sidebar-btn", function (e) {
      select("body").classList.toggle("toggle-sidebar");
    });
  }

  /**
   * Search bar toggle
   */
  if (select(".search-bar-toggle")) {
    on("click", ".search-bar-toggle", function (e) {
      select(".search-bar").classList.toggle("search-bar-show");
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /**
   * Initiate quill editors
   */
  if (select(".quill-editor-default")) {
    new Quill(".quill-editor-default", {
      theme: "snow",
    });
  }

  if (select(".quill-editor-bubble")) {
    new Quill(".quill-editor-bubble", {
      theme: "bubble",
    });
  }

  if (select(".quill-editor-full")) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [
            {
              font: [],
            },
            {
              size: [],
            },
          ],
          ["bold", "italic", "underline", "strike"],
          [
            {
              color: [],
            },
            {
              background: [],
            },
          ],
          [
            {
              script: "super",
            },
            {
              script: "sub",
            },
          ],
          [
            {
              list: "ordered",
            },
            {
              list: "bullet",
            },
            {
              indent: "-1",
            },
            {
              indent: "+1",
            },
          ],
          [
            "direction",
            {
              align: [],
            },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
      theme: "snow",
    });
  }

  const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 1023.5px)").matches;

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(needsValidation).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  /**
   * Autoresize echart charts
   */
  const mainContainer = select("#main");
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select(".echart", true).forEach((getEchart) => {
          echarts.getInstanceByDom(getEchart).resize();
        });
      }).observe(mainContainer);
    }, 200);
  }
})();

// close menu on clicking outside menu
//const $menu = $(".header__social .menuWithDropdown");
//$(document).mouseup((e) => {
//  if (
//    !$menu.is(e.target) && // if the target of the click isn't the container...
//    $menu.has(e.target).length === 0
//  ) {
//    // ... nor a descendant of the container
//    $(".dropdown-menu").removeClass("show").removeAttr("style");
//  }
//});



//$(document).ready(function(){		
//		$('.lms-dd .dropdown-toggle').on('click',function(){
//			$('.lms-dd .dropdown-toggle').not(this).removeClass('show');
//			     $('.lms-dd .dropdown-menu').not($(this).siblings('.dropdown-menu')).removeClass('show');
//			$(this).toggleClass('show');
//			$(this).siblings('.dropdown-menu').toggleClass('show');
//		 });
//	})
$(document).on('click', '.sidebar-nav .nav-link', function () {
  //	console.log('dsfsf');
  $('.sidebar-nav .nav-link').removeClass('enabled');
  $(this).addClass('enabled');
})


$('.header:not(.clms-dd .dropdown-toggle),.container-fluid:not(.clms-dd').on('click', function () {
  $('.clms-dd .dropdown-toggle').removeClass('on'); // Remove 'active' class from all .custom-btn elements
});


$('.clms-dd .dropdown-toggle').on('click', function (event) {
  event.stopPropagation();
  if ($(this).hasClass('on')) {
    $(this).removeClass('on');
  } else {
    $('.clms-dd .dropdown-toggle').removeClass('on');
    $(this).addClass('on');
  }
});

// JavaScript for checking viewport width
function checkWidth() {
  var maxWidth = 767;
  if (window.innerWidth <= maxWidth) {
    // Add click event handler for .head-menu elements
    $('.header__menu .head-menu').off('click').on('click', function () {
      // Toggle the 'active' class on the clicked .head-menu
      $(this).toggleClass('active');

      // Remove 'active' class from other .head-menu elements except the clicked one
      $('.header__menu .head-menu').not(this).removeClass('active');
    });
  } else {
    // If viewport width is greater than 767px, remove all 'active' classes
    $('.header__menu .head-menu').removeClass('active');
  }
}

// Run checkWidth on page load
$(document).ready(function () {
  checkWidth();
});

// Run checkWidth on window resize
$(window).resize(function () {
  checkWidth();
});

$(document).on('click', ".toggle-eye i", function () {
  $('.toggle-eye i').toggleClass('d-none');
  var passwordField = $('#yourPassword');

  // Get the current type of the password field
  var fieldType = passwordField.attr('type');

  // Toggle the field type
  if (fieldType === 'password') {
    passwordField.attr('type', 'text');
  } else {
    passwordField.attr('type', 'password');
  }
});
$(document).on('click', ".attech-btn", function () {
  $('.sidebar-wrapper').toggleClass("active");
});



function initializeSpeech() {
  // Check if SpeechSynthesis API is available
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    let currentIndex = 0;
    let tabKeyEventListener = null;

    // Function to speak the text of an element
    function speakText(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      synth.cancel(); // Cancel any existing speech
      synth.speak(utterance);
    }

    // Function to stop speaking
    function stopSpeaking() {
      synth.cancel();
    }

    // Handle button click for speech synthesis
    const toggleButton = document.getElementById('toggleSpeech');

    // Add null check to prevent the error
    if (!toggleButton) {
      console.warn('Element with ID "toggleSpeech" not found. Speech synthesis will not be available.');
      return; // Exit the function early
    }

    toggleButton.addEventListener('click', function () {
      const isActive = toggleButton.classList.contains('active');

      const readTags = document.querySelectorAll('.read-tag');

      if (!isActive) {
        // Enable speech synthesis on focus of read-tag elements
        readTags.forEach((element, index) => {
          element.addEventListener('focus', focusHandler);
        });

        // Handle keyboard Tab key press for speech synthesis
        tabKeyEventListener = function (event) {
          if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default Tab behavior

            // Stop speaking when Tab key is pressed
            stopSpeaking();

            // Focus the next read-tag element
            currentIndex = (currentIndex + 1) % readTags.length;
            readTags[currentIndex].focus();
          }
        };
        document.addEventListener('keydown', tabKeyEventListener);
      } else {
        // Disable speech synthesis on focus of read-tag elements
        readTags.forEach((element) => {
          element.removeEventListener('focus', focusHandler);
        });

        // Remove the Tab key event listener
        if (tabKeyEventListener) {
          document.removeEventListener('keydown', tabKeyEventListener);
          tabKeyEventListener = null;
        }

        stopSpeaking();
      }

      // Toggle active class
      toggleButton.classList.toggle('active');
    });

    // Function to handle focus events
    function focusHandler() {
      const text = this.innerText;
      speakText(text);
    }

    // Add event listener to stop speech synthesis on window change or refresh
    window.addEventListener('beforeunload', stopSpeaking);
    window.addEventListener('pagehide', stopSpeaking);
  } else {
    console.error('SpeechSynthesis API not supported.');
  }
}

// Initialize speech synthesis when the page loads
window.addEventListener('load', initializeSpeech)


$(document).ready(function () {
  if (sessionStorage.getItem('apimodal') != 'true') {
    //$('#myModal').modal('show'); // Show modal on page load
    sessionStorage.setItem('apimodal', 'true');
  }

});



$(document).ready(function () {

  $('.sidebar-nav .nav-content.show').each(function () {
    // Find the parent nav-item of the current nav-content
    $(this).closest('.nav-item').addClass('active-list');
  });

  $(document).on('click', '.button-part .filter-btn', function () {
    $('.filter-box').toggleClass('open');
  });

  $(document).on('click', '.filter-close-btn', function () {
    $('.filter-box').removeClass('open');
  });


});



const originalAlert = window.alert;
window.alert = function (message) {
  const stack = new Error().stack;
  if (stack.includes("at <anonymous>") || stack.includes("at eval") || stack.includes("@debugger eval")) {
    return;
  }
  originalAlert(message);
};



