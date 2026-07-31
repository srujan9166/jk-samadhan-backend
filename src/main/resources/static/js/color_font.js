// JavaScript Document

//SIDEBAR
$("#menu-toggle").click(function(e) {
	"use strict";
	e.stopPropagation();
	$("#wrapper").toggleClass("toggled");
	$(this).children('span').toggleClass("fa-window-close");
});
$('.overlay').on('click', function () {
	"use strict";
	$('#wrapper').removeClass('toggled');
	$("#menu-toggle").children('span').removeClass("fa-window-close").addClass("fa-bars");
});
$('#menu-toggle').on('click', function () {
	"use strict";
	$('#wrapper').addClass('toggled');
	$('.collapse.in').toggleClass('in');
	$('a[aria-expanded=true]').attr('aria-expanded', 'false');
	$("#menu-toggle").children('span').removeClass("fa-window-close").addClass("fa-bars");
});


				$('#toggleThemeButton input').on('change', function() {
				        if ($(this).is(':checked')) {
				            $('html').addClass('black-theme');
				        } else {
				            $('html').removeClass('black-theme');
				        }
				    });
				
				
//COLOR THEME
//$('#pink-theme-ctrl').click(switchPinkRed);
//$('#white-theme-ctrl').click(switchwhite);
//$('#purple-theme-ctrl').click(switchPurple);
//$('#black-theme-ctrl').click(switchblack);
//$('#orange-theme-ctrl').click(switchOrange);
//$('#gray-theme-ctrl').click(switchGray);
//
//function switchPinkRed() {
//  $('html').attr('class', 'pink-red-theme');
//}
//
//function switchwhite() {
//  $('html').attr('class', 'white-theme');
//}
//
//function switchPurple() {
//  $('html').attr('class', 'purple-theme');
//}
//
//function switchblack() {
//  $('html').attr('class', 'black-theme');
//}
//
//function switchOrange() {
//  $('html').attr('class', 'orange-theme');
//}
//function switchGray() {
//  $('html').attr('class', 'gray-theme');
//}

//FONT SIZE
	var $affectedElements = $("p, div, h1, h2, h3, h4, h5, h6, a, span, i, ol, ul, li, strong, blockquote, input, label, button");
	$affectedElements.each( function(){
	  var $this = $(this);
	  $this.data("orig-size", $this.css("font-size") );
	});

	$("#font-increase").click(function(){
		if($affectedElements.css("font-size") <= '18px'){
			changeFontSize(1); 
		}	 
	});

	$("#font-decrease").click(function(){
		if($affectedElements.css("font-size") >= '12px'){
			changeFontSize(-1);
		}
	});

	$("#font-original").click(function(){
	  $affectedElements.each( function(){
			var $this = $(this);
			$this.css( "font-size" , $this.data("orig-size") );
	   });
	});

	function changeFontSize(direction){
		$affectedElements.each( function(){
			var $this = $(this);
			$this.css( "font-size", parseInt($this.css("font-size"))+direction );
		});
	}

//NEWS SLIDER
// $('#nt-example1').newsTicker({
// 	row_height: 170,
// 	max_rows: 2,
// 	speed: 1000,
// 	duration: 4000,
// 	prevButton: $('#nt-example1-prev'),
// 	nextButton: $('#nt-example1-next')
// });

//PHOTO GALLERY
$(document).on("click", '[data-toggle="lightbox"]', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

//FIXED HEADER
$(window).scroll(function(){
  if ($(window).scrollTop() >= 130) {
    $('.sticky-header').addClass('fixed');
   }
   else {
    $('.sticky-header').removeClass('fixed');
   }
});

//SCROLL TO TOP
$(window).scroll(function(){
//	if ($(this).scrollTop() > 100) {
//		$('.scrollup').fadeIn();
//	} else {
//		$('.scrollup').fadeOut();
//	}
}); 

$('.scrollup').click(function(){
	$("html, body").animate({ scrollTop: 0 }, 600);
	return false;
});
