$("#userClarificationBtn").on("click", function () {
  const message = $("#userClarificationMessage").val();
  const gId = this.value;
  if (
    message === undefined ||
    message === null ||
    message.trim().length === 0
  ) {
    alert("Please enter your message.");
    return;
  }
  if (gId === undefined || gId === null || gId.trim().length === 0) {
    alert("Unable to find Application ID.");
    return;
  }

  const data = {
    message: message,
    gId: gId,
  };

  let d = chkV(JSON.stringify(data));

  let fileInput = document.getElementById("userClarificationMessageFile");
  let formData = new FormData();
  formData.append("d", d);
  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  console.log(formData);

  let settings = {
    url: "askClarification",
    method: "POST",
    data: formData,
    timeout: 0,
    processData: false,
    contentType: false,
  };

  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    if (j.statusCode != 0) {
      alert("Clarification sent successfully");
      window.location.reload();
    } else {
      if (j.hasOwnProperty("message")) {
        alert(j.message);
      }
    }
  });
});


// $("#userClarificationBtn").on("click", function () {
//   const message = $("#userClarificationMessage").val();
//   const gId = this.value;
//   if (
//     message === undefined ||
//     message === null ||
//     message.trim().length === 0
//   ) {
//     alert("Please enter your message.");
//     return;
//   }
//   if (gId === undefined || gId === null || gId.trim().length === 0) {
//     alert("Unable to find Application ID.");
//     return;
//   }

//   const data = {
//     message: message,
//     gId: gId,
//   };

//   let d = chkV(JSON.stringify(data));

//   let fileInput = document.getElementById("userClarificationMessageFile");
//   let formData = new FormData();
//   formData.append("d", d);
//   if (fileInput.files.length > 0) {
//     formData.append("file", fileInput.files[0]);
//   }

//   console.log(formData);

//   let settings = {
//     url: "askClarification",
//     method: "POST",
//     data: formData,
//     timeout: 0,
//     processData: false,
//     contentType: false,
//   };

//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);

//     if (j.statusCode != 0) {
//       alert("Clarification sent successfully");
//       window.location.reload();
//     } else {
//       if (j.hasOwnProperty("message")) {
//         alert(j.message);
//       }
//     }
//   });
// });
