document.getElementById('generate-pdf').addEventListener('click', function () {
  var content = document.getElementById('content');

  html2canvas(content).then(canvas => {
      var imgData = canvas.toDataURL('image/png');
      var pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      var imgWidth = 210; // A4 width in mm
      var pageHeight = 297;  // A4 height in mm
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
      }

      pdf.save('document.pdf');
  });
});

$(function () {
    $('li.rpt1 a').addClass('nav-head');
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

$('li.rpt1').on('click', function() {
    $(this).find('a').addClass('nav-head');  
    $('li.rpt2 a').removeClass('nav-head')
});

$('li.rpt2').on('click', function() {
    $('li.rpt1 a').removeClass('nav-head')
    $(this).find('a').addClass('nav-head');  
});