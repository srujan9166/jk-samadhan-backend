$(function () {
	$(document).on('click','.map-btn-wrapper button',function(){
		$('.map-btn-wrapper button').removeClass('active');
		$(this).addClass('active');
	});
});

const Listen = (doc) => {
  return {
    on: (type, selector, callback) => {
      doc.addEventListener(
        type,
        (event) => {
          if (!event.target.matches(selector)) return;
          callback.call(event.target, event);
        },
        false
      );
    },
  };
};

Listen(document).on("click", ".closeLogout", function (e) {
  this.closest("form").submit();
});

$("#depName").change(function () {
  var addDeptV = $("#depName").find(":selected").val();
  $("#categ").html("");
  $("#categ").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "categ?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == "1") {
        makeDropdown(categ, j.data);
      }
    });
    $("#categ").attr("disabled", false);
  } else {
    $("#categ").attr("disabled", true);
  }
});

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}






