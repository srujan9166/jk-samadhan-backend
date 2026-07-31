//Utsav 

//Stop Inspect Element
/** 
 * Disable right-click of mouse, F12 key, and save key combinations on page 
 */


	

	
$(document).ready(function() {
	//debugger
	$('#sname, #smob, #smail, #descriptionsone,#descriptionstwo,#descriptionsthree,#descriptionsthree,#descrp').on('keyup', function() {
	  restrictSpecialChars($(this));
	});
  });
  
  function restrictSpecialChars(input) {
	if (input.attr('id') === 'sname') {
	  input.val(input.val().replace(/[^a-zA-Z\s]/g, ''));
	} else if (input.attr('id') === 'smob') {
	  input.val(input.val().replace(/[^0-9]/g, ''));
	} else if (input.attr('id') === 'smail') {
	  input.val(input.val().replace(/[^a-zA-Z0-9@.-]/g, ''));
	} else if (input.attr('id') === 'descriptionsone') {
	  input.val(input.val().replace(/[^0-9a-zA-Z:,-. \s]/g, ''));
	 }else if (input.attr('id') === 'descriptionstwo') {
		input.val(input.val().replace(/[^0-9a-zA-Z:,-. \s]/g, ''));
	}else if (input.attr('id') === 'descriptionsthree') {
		input.val(input.val().replace(/[^0-9a-zA-Z:,-. \s]/g, ''));
	}
  }
//  document.addEventListener("contextmenu", function(e){ 
//  e.preventDefault(); 
//  }, false); 
//  document.addEventListener("keydown", function(e) { 
//  //document.onkeydown = function(e) { 
//  // "I" key 
//  if (e.ctrlKey && e.shiftKey && e.keyCode == 73) { 
//  disabledEvent(e); 
//  } 
//  // "J" key 
//  if (e.ctrlKey && e.shiftKey && e.keyCode == 74) { 
//  disabledEvent(e); 
//  } 
//  // "S" key + macOS 
//  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) { 
//  disabledEvent(e); 
//  } 
//  // "U" key 
//  if (e.ctrlKey && e.keyCode == 85) { 
//  disabledEvent(e); 
//  } 
//  // "F12" key 
//  if (event.keyCode == 123) { 
//  disabledEvent(e); 
//  } 
//  // "C" key 
//  if (e.ctrlKey && event.keyCode == 67) { 
//  disabledEvent(e); 
//  } 
//  }, false); 
//  function disabledEvent(e){ 
//  if (e.stopPropagation){ 
//  e.stopPropagation(); 
//  } else if (window.event){ 
//  window.event.cancelBubble = true; 
//  } 
//  e.preventDefault(); 
//  return false; 
//  }
  //back open
//  $(document).ready(function(){
//    $("*").attr("target", "_self");
//});

