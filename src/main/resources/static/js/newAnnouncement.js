// start kajal 30 May 2025

//  Unified DataTable export handler Changes by Naitik 
function bindExportButtons(table, wrapperSelector) {
    $(wrapperSelector + " .dwd-customBtnNo").off("click").on("click", function () {
        table.button("." + $(this).val()).trigger();
    });
}
//Naitik changes end

// start 16 June 2025 - MIS Report Table
let misReportTable;
$(document).ready(function () {
    misReportTable = $('#misReportTable').DataTable({
        lengthMenu: [10, 50, 100],
        pageLength: 10,
        dom: "Bfrtip",
        buttons: [
            {
                extend: "excel",
                className: "buttons-excel",
                title: "JKGOVT - MIS Report",
                messageTop: "The information in this table is copyright to JK GOVT.",

                //Naitik Changes on pdf format 03/10/2025
                exportOptions: {
                    columns: ":not(.noExport)",
                    format: {
                        body: function (data, row, column, node) {
                            return node.textContent || data;
                        }
                    }
                }
                //Naitik Changes End on 03/10/2025

            },
            {
                extend: "pdf",
                className: "buttons-pdf",
                title: "JKGOVT - MIS Report",
                messageBottom: "The information in this table is copyright to JK GOVT.",
                pageSize: "A4",
                download: "open",
                customize: function (doc) {
                    doc.pageSize = "A4";
                    doc.pageOrientation = "landscape";

                    doc.styles.tableHeader.fontSize = 8;
                    doc.styles.tableBodyOdd.fontSize = 8;
                    doc.styles.tableBodyEven.fontSize = 8;

                    var rowCount = doc.content[1].table.body.length;
                    for (var i = 0; i < rowCount; i++) {
                        var row = doc.content[1].table.body[i];
                        for (var j = 0; j < row.length; j++) {
                            row[j].alignment = "center";
                        }
                    }

                    var totalColumns = doc.content[1].table.body[0].length;
                    var columnWidths = [];
                    for (var i = 0; i < totalColumns; i++) {
                        columnWidths.push("*");
                    }
                    doc.content[1].table.widths = columnWidths;
                },
                //Naitik Changes on download format 03/10/2025
                exportOptions: {
                    columns: ":not(.noExport)",
                    format: {
                        body: function (data, row, column, node) {
                            return node.textContent || data;  // plain text only
                        }
                    }
                }
                //download Changes End by Naitik

            }
        ]
    });

    // ✅ Attach MIS Report export buttons
    bindExportButtons(misReportTable, "#misReportSection");
});

// start kajal 17 June - Announcement Table
$(document).ready(function () {
    const table = $('#announcementTable').DataTable({
        lengthMenu: [10, 50, 100],
        pageLength: 10
    });

    function getValidTillColumnIndex() {
        let index = -1;
        $('#announcementTable thead th').each(function (i) {
            if ($(this).text().trim().toLowerCase() === 'valid till') {
                index = i;
                return false;
            }
        });
        return index;
    }

    function disableExpiredToggles() {
        const validTillColIndex = getValidTillColumnIndex();
        if (validTillColIndex === -1) return;

        $('#announcementTable tbody tr').each(function () {
            const row = $(this);
            const validTillText = row.find(`td:eq(${validTillColIndex})`).text().trim();

            if (validTillText) {
                const [datePart, timePart] = validTillText.split(' ');
                if (!datePart || !timePart) return;

                const [day, month, year] = datePart.split('-').map(Number);
                const [hour, minute, second] = timePart.split(':').map(Number);

                const validTillDate = new Date(year, month - 1, day, hour, minute, second);
                const now = new Date();

                const toggle = row.find('.announcement-toggle');
                if (now > validTillDate) {
                    row.find('.announcement-toggle').closest('.form-check').remove();
                } else {
                    toggle.prop('disabled', false);
                }
            }
        });
    }

    disableExpiredToggles();
    $('#announcementTable').on('draw.dt', function () {
        disableExpiredToggles();
    });

    $('#announcementSection').on('change', '.announcement-toggle', function () {
        const checkbox = $(this);
        if (checkbox.prop('disabled')) return;

        const id = checkbox.data('id');
        const newStatus = checkbox.is(':checked') ? 1 : 0;

        $.ajax({
            url: 'updateAnnouncementStatus',
            method: 'POST',
            contentType: 'application/json',
            data: chkV(JSON.stringify({ id: id, isactive: newStatus })),
            success: function () {
                console.log('Status updated for ID: ' + id);
            },
            error: function () {
                alert('Failed to update status');
                checkbox.prop('checked', !checkbox.is(':checked'));
            }
        });
    });
});

// start kajal 2 june 2025 - Toggle between sections
document.addEventListener("DOMContentLoaded", function () {
    const announcementRadio = document.getElementById("announcement-search");
    const misReportRadio = document.getElementById("misreport-search");
    const announcementSection = document.getElementById("announcementSection");
    const misReportSection = document.getElementById("misReportSection");

    function toggleSections() {
        if (announcementRadio.checked) {
            announcementSection.style.display = "block";
            misReportSection.style.display = "none";
        } else if (misReportRadio.checked) {
            announcementSection.style.display = "none";
            misReportSection.style.display = "block";
        }
    }
    toggleSections();
    announcementRadio.addEventListener("change", toggleSections);
    misReportRadio.addEventListener("change", toggleSections);
});

// Start Kajal 12 June - Department modal
let departmentDetailsTable;
const modal = new bootstrap.Modal(document.getElementById('departmentDetailsModal'));

$(document).on('click', '.department-count-link', function (e) {
    e.preventDefault();
    const department = $(this).data('department');

    modal.show();
    //Naitik Changes Start on 03/09/2025
    $.ajax({
        url: 'departmentAnnouncementsData?d=' + chkV(JSON.stringify({ department: department })),
        method: 'POST',
        success: function (data) {
            $('#departmentDetailsModalLabel').text(`Announcements for ${department}`);

            departmentDetailsTable = $('#departmentDetailsTable').DataTable({
                data: data,
                lengthMenu: [10, 50, 100],
                pageLength: 10,
                destroy: true,
                dom: "Bfrtip",
                buttons: [
                    {
                        extend: "excel",
                        className: "buttons-excel",
                        title: "JKGOVT",
                        messageTop: "The information in this table is copyright to JK GOVT.",
                        exportOptions: { columns: ":not(.noExport)" }
                    },
                    {
                        extend: "pdf",
                        className: "buttons-pdf",
                        title: "JKGOVT",
                        messageBottom: "The information in this table is copyright to JK GOVT.",
                        pageSize: "A4",
                        download: "open",
                        customize: function (doc) {
                            doc.pageSize = "A4";
                            doc.pageOrientation = "landscape";

                            doc.styles.tableHeader.fontSize = 8;
                            doc.styles.tableBodyOdd.fontSize = 8;
                            doc.styles.tableBodyEven.fontSize = 8;

                            var rowCount = doc.content[1].table.body.length;
                            for (var i = 0; i < rowCount; i++) {
                                var row = doc.content[1].table.body[i];
                                for (var j = 0; j < row.length; j++) {
                                    row[j].alignment = "center";
                                }
                            }

                            var totalColumns = doc.content[1].table.body[0].length;
                            var columnWidths = [];
                            for (var i = 0; i < totalColumns; i++) {
                                columnWidths.push("*");
                            }
                            doc.content[1].table.widths = columnWidths;
                        },
                        exportOptions: { columns: ":not(.noExport)" }
                    }
                ],
                columns: [
                    {
                        data: null,
                        title: "S. No.",
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    {
                        data: "office_name",
                        defaultContent: "",
                        title: "Office Name"
                    },
                    {
                        data: "type",
                        defaultContent: "",
                        title: "Type"

                    },

                    {
                        data: "name_with_designation",
                        defaultContent: "",
                        title: "Created By"
                    },
                    {
                        data: "notification",
                        defaultContent: "",
                        title: "Notification"
                    },
                    {
                        data: "createdat",
                        defaultContent: "",
                        title: "Created At"
                    },

                    {
                        data: "validtill",
                        defaultContent: "",
                        title: "Valid Till"
                    }
                ]
            });

            bindExportButtons(departmentDetailsTable, "#departmentDetailsModal");
        },
        error: function () {
            alert("Failed to fetch department announcements");
        }
    });
});

//Naitik Changes End
