$(document).ready(function () {
  $(".cBb").click(function () {
    // Go back to the previous page
    window.history.back();
  });
});

// $(function () {
// 	$(".cBb").on('click', function () {
// 	// Check if there's a history to go back to
// 	            if (window.history.length > 1) {
// 	               // window.history.back();
// 				   window.history.go(-1); // Go back to the previous page
// 	            } else {
// 	                // Redirect to a default page if no history
// 	                window.location.href = "home";
// 	            }
// 	 });
// });
