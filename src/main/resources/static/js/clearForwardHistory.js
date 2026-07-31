$(document).ready(function () {
	if (window.location.href.indexOf("/home") != -1) {
		// Replace the current state to prevent back navigation
		    history.pushState(null, "", location.href);
		    history.replaceState(null, "", location.href);

		    // Handle back navigation
		    window.onpopstate = function () {
		        history.go(1); // Move forward in history
		    };
		
	}
  // Replace the current state to clear forward history
  var currentPage = location.href;
  history.pushState(null, "", currentPage);
});
$(function () {
	$(".cBb").on('click', function () {
	// Check if there's a history to go back to
	            if (window.history.length > 1) {
	               // window.history.back();
				   window.history.go(-1); // Go back to the previous page
	            } else {
	                // Redirect to a default page if no history
	                window.location.href = "home";
	            }
	 });

});


document.addEventListener('DOMContentLoaded',function(){
		   			var loader = document.getElementById('loader');
		   			loader.style.display = 'none'; 
		   		});  

