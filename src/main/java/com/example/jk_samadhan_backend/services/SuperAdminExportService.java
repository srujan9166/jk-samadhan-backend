package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.ExportJobStatusDTO;
import com.example.jk_samadhan_backend.dto.SuperAdminExportJob;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.compress.archivers.zip.ZipFile;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Qualifier;
import java.util.concurrent.Executor;

@Service
public class SuperAdminExportService {

    private static final Logger logger = LoggerFactory.getLogger(SuperAdminExportService.class);
    private static final int CHUNK_SIZE = 5000;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    private final JdbcTemplate jdbcTemplate;
    private final Executor exportTaskExecutor;
    private final Map<String, SuperAdminExportJob> jobRegistry = new ConcurrentHashMap<>();
    private final Map<String, SuperAdminExportJob> pdfJobRegistry = new ConcurrentHashMap<>();

    public SuperAdminExportService(JdbcTemplate jdbcTemplate, @Qualifier("exportTaskExecutor") Executor exportTaskExecutor) {
        this.jdbcTemplate = jdbcTemplate;
        this.exportTaskExecutor = exportTaskExecutor;
    }

    /**
     * Start a new asynchronous complete export job for Super Admin.
     * Guaranteed to query ALL records with zero filters.
     */
    public ExportJobStatusDTO startExcelExport(String username) {
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss").format(LocalDateTime.now());
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String jobId = "EXPORT-" + timestamp + "-" + randomSuffix;

        SuperAdminExportJob job = SuperAdminExportJob.builder()
                .jobId(jobId)
                .initiatedBy(username)
                .status("PROCESSING")
                .progress(0)
                .createdAt(LocalDateTime.now())
                .build();

        jobRegistry.put(jobId, job);
        logger.info("Created Super Admin Excel export job {} initiated by {}", jobId, username);

        // Run asynchronously in dedicated background executor thread pool
        // This ensures startExcelExport returns immediately (<10ms) so frontend polling starts right away
        exportTaskExecutor.execute(() -> executeExportJob(jobId));

        return ExportJobStatusDTO.builder()
                .jobId(jobId)
                .status("PROCESSING")
                .progress(0)
                .message("Export job started")
                .build();
    }

    /**
     * Background worker task that queries in chunks and streams to XLSX file.
     * Runs on an exportTaskExecutor background worker thread.
     */
    public void executeExportJob(String jobId) {
        SuperAdminExportJob job = jobRegistry.get(jobId);
        if (job == null) {
            logger.error("Job {} not found in registry", jobId);
            return;
        }

        SXSSFWorkbook workbook = null;
        File tempFile = null;
        File rawTempFile = null;

        try {
            if (isCancelled(job)) {
                logger.info("Job {} was cancelled before starting.", jobId);
                return;
            }
            // 1. Get total record count
            String countSql = "SELECT count(*) FROM jks_3nf.grievance_master";
            Long totalCount = jdbcTemplate.queryForObject(countSql, Long.class);
            long totalRecords = (totalCount != null) ? totalCount : 0L;
            job.setTotalRecords(totalRecords);
            logger.info("Job {}: Total records to export = {}", jobId, totalRecords);

            // 2. Setup temporary file storage
            File exportDir = new File(System.getProperty("java.io.tmpdir"), "jk_exports");
            if (!exportDir.exists() && !exportDir.mkdirs()) {
                logger.warn("Could not create export directory: {}", exportDir.getAbsolutePath());
            }

            String fileName = "SuperAdmin_Grievances_Report_" + LocalDate.now() + "_" + jobId + ".xlsx";
            tempFile = new File(exportDir, fileName);

            // 3. Initialize streaming workbook (100 rows in memory, rest flushed to disk)
            workbook = new SXSSFWorkbook(100);
            workbook.setCompressTempFiles(true);

            Sheet sheet = workbook.createSheet("Super Admin Grievances");

            // Define styles
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle subtitleStyle = createSubtitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle evenRowStyle = createRowStyle(workbook, IndexedColors.WHITE.getIndex());
            CellStyle oddRowStyle = createRowStyle(workbook, IndexedColors.GREY_25_PERCENT.getIndex());

            int rowIdx = 0;

            // Row 0: Title
            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("JKGOVT - SUPER ADMIN GRIEVANCES REPORT");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(titleRow.getRowNum(), titleRow.getRowNum(), 0, 21));

            // Row 1: Subtitle
            Row subtitleRow = sheet.createRow(rowIdx++);
            Cell subtitleCell = subtitleRow.createCell(0);
            subtitleCell.setCellValue("Generated on: " + LocalDateTime.now().format(DATE_FORMATTER) + " | The information in this report is confidential and copyright to JK GOVT.");
            subtitleCell.setCellStyle(subtitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(subtitleRow.getRowNum(), subtitleRow.getRowNum(), 0, 21));

            // Row 2: Fixed Super Admin Headers
            String[] headers = {
                    "S.No.",
                    "Grievance ID",
                    "Department",
                    "Category",
                    "Sub Category",
                    "Sub Category L2",
                    "Sub Category L3",
                    "Sub Category L4",
                    "Submitted By",
                    "Mobile Number",
                    "Submitted On",
                    "Window",
                    "Division",
                    "District",
                    "Status",
                    "Final Status",
                    "Priority",
                    "AI Classification",
                    "Assigned Department",
                    "Assigned Officer",
                    "Resolution Date",
                    "Appeal Status"
            };

            Row headerRow = sheet.createRow(rowIdx++);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Freeze header rows
            sheet.createFreezePane(0, rowIdx);


            // 4. Stream database records in chunks using keyset pagination
            String chunkSql = """
                SELECT 
                    gm.id,
                    gm.uniq_id,
                    COALESCE(dept.name, 'General Administration') AS department,
                    COALESCE(cat.name, 'General Complaints & Petitions') AS category,
                    COALESCE(s1.name, 'NA') AS sub_category,
                    COALESCE(s2.name, 'NA') AS sub_cat_l2,
                    COALESCE(s3.name, 'NA') AS sub_cat_l3,
                    COALESCE(s4.name, 'NA') AS sub_cat_l4,
                    COALESCE(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.middle_name, ''), ' ', COALESCE(u.last_name, ''))), 'CITIZEN USER') AS submitted_by,
                    COALESCE(u.mobile, 'NA') AS mobile_number,
                    gm.created_at AS submitted_on,
                    gm.origin AS window,
                    COALESCE(div.name, 'UT') AS division,
                    COALESCE(dist.name, 'NA') AS district,
                    gm.status,
                    COALESCE(gm.final_status, 'Submitted') AS final_status,
                    COALESCE(gm.key_flag, 'Normal') AS priority,
                    COALESCE(gm.key_flag, 'Normal') AS ai_classification,
                    COALESCE(au_latest.department, dept.name, 'NA') AS assigned_department,
                    COALESCE(TRIM(CONCAT(COALESCE(u_to.first_name, ''), ' ', COALESCE(u_to.last_name, ''))), u_to.username, 'NA') AS assigned_officer,
                    CASE WHEN gm.status IN ('Resolved', 'Closed', 'Final Disposed') THEN gm.updated_at ELSE NULL END AS resolution_date,
                    COALESCE(am_latest.status, 'Not Appealed') AS appeal_status
                FROM jks_3nf.grievance_master gm
                LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                LEFT JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                LEFT JOIN jks_3nf.subcategory_level1 s1 ON s1.id = gm.sub_cat_l1_id
                LEFT JOIN jks_3nf.subcategory_level2 s2 ON s2.id = gm.sub_cat_l2_id
                LEFT JOIN jks_3nf.subcategory_level3 s3 ON s3.id = gm.sub_cat_l3_id
                LEFT JOIN jks_3nf.subcategory_level4 s4 ON s4.id = gm.sub_cat_l4_id
                LEFT JOIN jks_3nf.districts dist ON dist.id = gm.district_id
                LEFT JOIN jks_3nf.divisions div ON div.id = dist.division_id
                LEFT JOIN jks_3nf.users u ON u.id = gm.submitted_by_user_id
                LEFT JOIN LATERAL (
                    SELECT au.department, au.assigned_to_user_id 
                    FROM jks_3nf.assigned_users au 
                    WHERE au.grievance_id = gm.id AND au.enabled = true 
                    ORDER BY au.created_at DESC LIMIT 1
                ) au_latest ON TRUE
                LEFT JOIN jks_3nf.users u_to ON u_to.id = au_latest.assigned_to_user_id
                LEFT JOIN LATERAL (
                    SELECT am.status 
                    FROM jks_3nf.appeal_master am 
                    WHERE am.grievance_id = gm.id 
                    ORDER BY am.created_at DESC LIMIT 1
                ) am_latest ON TRUE
                WHERE gm.id > ?
                ORDER BY gm.id ASC
                LIMIT ?
            """;

            long lastId = 0L;
            long processedRecords = 0L;
            int serialNumber = 1;

            while (true) {
                if (isCancelled(job)) {
                    logger.info("Job {} was cancelled before querying next chunk. Halting background export.", jobId);
                    cleanupFiles(tempFile, rawTempFile, workbook);
                    return;
                }

                List<Map<String, Object>> rows = jdbcTemplate.queryForList(chunkSql, lastId, CHUNK_SIZE);
                if (rows.isEmpty()) {
                    break;
                }

                if (isCancelled(job)) {
                    logger.info("Job {} was cancelled after chunk query. Halting background export.", jobId);
                    cleanupFiles(tempFile, rawTempFile, workbook);
                    return;
                }

                for (Map<String, Object> r : rows) {
                    Row dataRow = sheet.createRow(rowIdx++);
                    CellStyle rowStyle = (serialNumber % 2 == 0) ? oddRowStyle : evenRowStyle;

                    int col = 0;
                    createCell(dataRow, col++, serialNumber++, rowStyle);
                    createCell(dataRow, col++, getString(r.get("uniq_id")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("department")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("category")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("sub_category")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("sub_cat_l2")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("sub_cat_l3")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("sub_cat_l4")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("submitted_by")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("mobile_number")), rowStyle);
                    createCell(dataRow, col++, formatDate(r.get("submitted_on")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("window")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("division")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("district")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("status")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("final_status")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("priority")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("ai_classification")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("assigned_department")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("assigned_officer")), rowStyle);
                    createCell(dataRow, col++, formatDate(r.get("resolution_date")), rowStyle);
                    createCell(dataRow, col++, getString(r.get("appeal_status")), rowStyle);

                    lastId = ((Number) r.get("id")).longValue();
                    processedRecords++;
                }

                job.setProcessedRecords(processedRecords);
                int progress = totalRecords > 0 ? (int) Math.min(99, (processedRecords * 100) / totalRecords) : 99;
                job.setProgress(progress);
                logger.info("Job {}: Processed {} / {} records ({}%)", jobId, processedRecords, totalRecords, progress);

                if (isCancelled(job)) {
                    logger.info("Job {} was cancelled during chunk processing. Halting background export.", jobId);
                    cleanupFiles(tempFile, rawTempFile, workbook);
                    return;
                }
            }

            // Autofilter covering headers and all data rows (valid OpenXML / ClosedXML range)
            if (rowIdx > headerRow.getRowNum() + 1) {
                sheet.setAutoFilter(new CellRangeAddress(headerRow.getRowNum(), rowIdx - 1, 0, headers.length - 1));
            }

            // Set column widths
            for (int i = 0; i < headers.length; i++) {
                sheet.setColumnWidth(i, 20 * 256);
            }
            sheet.setColumnWidth(0, 8 * 256); // S.No.
            sheet.setColumnWidth(1, 18 * 256); // Grievance ID
            sheet.setColumnWidth(2, 30 * 256); // Department
            sheet.setColumnWidth(3, 30 * 256); // Category
            sheet.setColumnWidth(8, 25 * 256); // Submitted By
            sheet.setColumnWidth(10, 22 * 256); // Submitted On

            if (isCancelled(job)) {
                logger.info("Job {} was cancelled before writing workbook. Halting export.", jobId);
                cleanupFiles(tempFile, rawTempFile, workbook);
                return;
            }

            // 5. Write to temporary disk file
            rawTempFile = new File(exportDir, "raw_" + fileName);
            try (FileOutputStream fos = new FileOutputStream(rawTempFile)) {
                workbook.write(fos);
            }

            if (isCancelled(job)) {
                logger.info("Job {} was cancelled before normalizing ZIP. Halting export.", jobId);
                cleanupFiles(tempFile, rawTempFile, workbook);
                return;
            }

            // 6. Normalize ZIP headers with seekable ZipArchiveOutputStream
            // This ensures local file headers have explicit CRC-32 and sizes, clearing bit 3 (data descriptors)
            // Completely fixes the "Bad uncompressed size" issue in Bree XLSX Editor and JSZip/SheetJS viewers.
            normalizeZipHeaders(rawTempFile, tempFile);
            if (rawTempFile.exists()) {
                rawTempFile.delete();
            }

            if (isCancelled(job)) {
                logger.info("Job {} was cancelled before final completion. Cleaning up.", jobId);
                cleanupFiles(tempFile, rawTempFile, workbook);
                return;
            }

            job.setFilePath(tempFile.getAbsolutePath());
            job.setFileName(fileName);
            job.setProgress(100);
            job.setStatus("COMPLETED");
            job.setCompletedAt(LocalDateTime.now());
            logger.info("Job {} successfully COMPLETED and normalized. Generated file: {} (size: {} bytes)", jobId, tempFile.getAbsolutePath(), tempFile.length());

        } catch (Exception e) {
            if (job != null && !"CANCELLED".equals(job.getStatus())) {
                logger.error("Job " + jobId + " failed with exception: " + e.getMessage(), e);
                job.setStatus("FAILED");
                job.setErrorMessage(e.getMessage() != null ? e.getMessage() : "Unknown error during export");
            }
            cleanupFiles(tempFile, rawTempFile, workbook);
        } finally {
            if (workbook != null) {
                try {
                    workbook.dispose(); // clean up temporary xml files created by SXSSF
                    workbook.close();
                } catch (Exception ignored) {
                }
            }
            if (isCancelled(job)) {
                cleanupFiles(tempFile, rawTempFile, null);
            }
        }
    }

    /**
     * Get current status and progress of an export job.
     */
    public ExportJobStatusDTO getJobStatus(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = jobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("Export job not found: " + jobId);
        }

        // Security check
        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to view this export job");
        }

        String downloadUrl = "COMPLETED".equals(job.getStatus())
                ? "/api/super-admin/export/excel/" + jobId + "/download"
                : null;

        return ExportJobStatusDTO.builder()
                .jobId(job.getJobId())
                .status(job.getStatus())
                .progress(job.getProgress())
                .totalRecords(job.getTotalRecords())
                .processedRecords(job.getProcessedRecords())
                .message("COMPLETED".equals(job.getStatus()) ? "Export ready for download" : job.getErrorMessage())
                .downloadUrl(downloadUrl)
                .build();
    }

    /**
     * Cancel an active export job.
     */
    public ExportJobStatusDTO cancelExportJob(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = jobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("Export job not found: " + jobId);
        }

        // Security check: only the initiator or super admin can cancel
        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to cancel this export job");
        }

        if ("COMPLETED".equals(job.getStatus())) {
            return ExportJobStatusDTO.builder()
                    .jobId(job.getJobId())
                    .status(job.getStatus())
                    .progress(job.getProgress())
                    .totalRecords(job.getTotalRecords())
                    .processedRecords(job.getProcessedRecords())
                    .message("Export job has already completed")
                    .build();
        }

        logger.info("Cancelling export job {} by user {}", jobId, username);
        job.setStatus("CANCELLED");
        job.setErrorMessage("Export cancelled by user");

        if (job.getFilePath() != null) {
            try {
                File f = new File(job.getFilePath());
                if (f.exists()) {
                    f.delete();
                }
            } catch (Exception e) {
                logger.warn("Could not delete cancelled export file: {}", e.getMessage());
            }
            job.setFilePath(null);
        }

        return ExportJobStatusDTO.builder()
                .jobId(job.getJobId())
                .status("CANCELLED")
                .progress(job.getProgress())
                .totalRecords(job.getTotalRecords())
                .processedRecords(job.getProcessedRecords())
                .message("Export job cancelled successfully")
                .build();
    }

    private boolean isCancelled(SuperAdminExportJob job) {
        return job != null && "CANCELLED".equals(job.getStatus());
    }

    private void cleanupFiles(File tempFile, File rawTempFile, SXSSFWorkbook workbook) {
        if (workbook != null) {
            try {
                workbook.dispose();
                workbook.close();
            } catch (Exception ignored) {}
        }
        if (rawTempFile != null && rawTempFile.exists()) {
            try { rawTempFile.delete(); } catch (Exception ignored) {}
        }
        if (tempFile != null && tempFile.exists()) {
            try { tempFile.delete(); } catch (Exception ignored) {}
        }
    }

    /**
     * Download the generated export file.
     */
    public Resource getExportFileResource(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = jobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("Export job not found: " + jobId);
        }

        // Security check
        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to download this export");
        }

        if (!"COMPLETED".equals(job.getStatus())) {
            throw new IllegalStateException("Export job is not completed yet (current status: " + job.getStatus() + ")");
        }

        File file = new File(job.getFilePath());
        if (!file.exists()) {
            throw new IllegalStateException("Export file no longer exists on server");
        }

        return new FileSystemResource(file);
    }

    public String getExportFileName(String jobId) {
        SuperAdminExportJob job = jobRegistry.get(jobId);
        if (job != null && job.getFileName() != null) {
            return job.getFileName();
        }
        return "SuperAdmin_Grievances_Report_" + LocalDate.now() + ".xlsx";
    }

    /**
     * Scheduled cleanup every 30 minutes for export jobs older than 2 hours.
     */
    @Scheduled(fixedRate = 1800000)
    public void cleanupOldJobs() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(2);
        List<String> toRemoveExcel = new ArrayList<>();
        List<String> toRemovePdf = new ArrayList<>();

        jobRegistry.forEach((jobId, job) -> {
            if (job.getCreatedAt() != null && job.getCreatedAt().isBefore(cutoff)) {
                toRemoveExcel.add(jobId);
                if (job.getFilePath() != null) {
                    try {
                        File f = new File(job.getFilePath());
                        if (f.exists()) {
                            f.delete();
                        }
                    } catch (Exception e) {
                        logger.warn("Could not delete old export file {}: {}", job.getFilePath(), e.getMessage());
                    }
                }
            }
        });

        pdfJobRegistry.forEach((jobId, job) -> {
            if (job.getCreatedAt() != null && job.getCreatedAt().isBefore(cutoff)) {
                toRemovePdf.add(jobId);
                if (job.getFilePath() != null) {
                    try {
                        File f = new File(job.getFilePath());
                        if (f.exists()) {
                            f.delete();
                        }
                    } catch (Exception e) {
                        logger.warn("Could not delete old PDF export file {}: {}", job.getFilePath(), e.getMessage());
                    }
                }
            }
        });

        for (String id : toRemoveExcel) {
            jobRegistry.remove(id);
            logger.info("Purged expired Excel export job {}", id);
        }
        for (String id : toRemovePdf) {
            pdfJobRegistry.remove(id);
            logger.info("Purged expired PDF export job {}", id);
        }
    }

    /**
     * Normalizes the ZIP archive created by SXSSFWorkbook.
     * SXSSFWorkbook writes streaming entries with data descriptors (bit 3 set and size 0 in local header),
     * which causes strict parsers like Bree XLSX Editor (JSZip) to fail with 'Bad uncompressed size'.
     * By rewriting with ZipArchiveOutputStream in seekable mode, local headers are updated with exact sizes and CRC-32.
     */
    private void normalizeZipHeaders(File srcFile, File destFile) throws Exception {
        try (ZipFile zipFile = new ZipFile(srcFile);
             ZipArchiveOutputStream zaos = new ZipArchiveOutputStream(destFile)) {

            Enumeration<ZipArchiveEntry> entries = zipFile.getEntries();
            byte[] buffer = new byte[65536];

            while (entries.hasMoreElements()) {
                ZipArchiveEntry oldEntry = entries.nextElement();
                ZipArchiveEntry newEntry = new ZipArchiveEntry(oldEntry.getName());
                newEntry.setMethod(oldEntry.getMethod());

                zaos.putArchiveEntry(newEntry);
                try (InputStream is = zipFile.getInputStream(oldEntry)) {
                    int read;
                    while ((read = is.read(buffer)) != -1) {
                        zaos.write(buffer, 0, read);
                    }
                }
                zaos.closeArchiveEntry();
            }
            zaos.finish();
        }
    }

    // --- Helper formatting methods ---

    private void createCell(Row row, int col, Object val, CellStyle style) {
        Cell c = row.createCell(col);
        if (val instanceof Number n) {
            c.setCellValue(n.doubleValue());
        } else {
            c.setCellValue(val != null ? val.toString() : "");
        }
        c.setCellStyle(style);
    }

    private String getString(Object obj) {
        if (obj == null) return "NA";
        String s = obj.toString().trim();
        return s.isEmpty() ? "NA" : s;
    }

    private String formatDate(Object obj) {
        if (obj == null) return "NA";
        if (obj instanceof Timestamp ts) {
            return ts.toLocalDateTime().format(DATE_FORMATTER);
        }
        if (obj instanceof LocalDateTime ldt) {
            return ldt.format(DATE_FORMATTER);
        }
        return obj.toString();
    }

    private CellStyle createTitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createSubtitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setItalic(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createRowStyle(Workbook wb, short bgColor) {
        CellStyle style = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = wb.createFont();
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        if (bgColor != IndexedColors.WHITE.getIndex()) {
            style.setFillForegroundColor(bgColor);
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return style;
    }

    // ==========================================
    // Super Admin Complete PDF Export (Asynchronous)
    // ==========================================

    public ExportJobStatusDTO startPdfExport(String username) {
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss").format(LocalDateTime.now());
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String jobId = "PDF-EXPORT-" + timestamp + "-" + randomSuffix;

        SuperAdminExportJob job = SuperAdminExportJob.builder()
                .jobId(jobId)
                .initiatedBy(username)
                .status("PROCESSING")
                .progress(0)
                .createdAt(LocalDateTime.now())
                .build();

        pdfJobRegistry.put(jobId, job);
        logger.info("Created Super Admin PDF export job {} initiated by {}", jobId, username);

        exportTaskExecutor.execute(() -> executePdfExportJob(jobId));

        return ExportJobStatusDTO.builder()
                .jobId(jobId)
                .status("PROCESSING")
                .progress(0)
                .message("PDF Export job started")
                .build();
    }

    public void executePdfExportJob(String jobId) {
        SuperAdminExportJob job = pdfJobRegistry.get(jobId);
        if (job == null) {
            logger.error("PDF Export Job {} not found in registry", jobId);
            return;
        }

        Document document = null;
        PdfWriter writer = null;
        File tempFile = null;

        try {
            if (isCancelled(job)) {
                logger.info("PDF Job {} was cancelled before starting.", jobId);
                return;
            }

            // 1. Get total record count
            String countSql = "SELECT count(*) FROM jks_3nf.grievance_master";
            Long totalCount = jdbcTemplate.queryForObject(countSql, Long.class);
            long totalRecords = (totalCount != null) ? totalCount : 0L;
            job.setTotalRecords(totalRecords);
            logger.info("PDF Job {}: Total records to export = {}", jobId, totalRecords);

            // 2. Setup temporary file storage
            File exportDir = new File(System.getProperty("java.io.tmpdir"), "jk_exports");
            if (!exportDir.exists() && !exportDir.mkdirs()) {
                logger.warn("Could not create export directory: {}", exportDir.getAbsolutePath());
            }

            String fileName = "SuperAdmin_Grievances_Report_" + LocalDate.now() + "_" + jobId + ".pdf";
            tempFile = new File(exportDir, fileName);

            // 3. Initialize OpenPDF Document in Landscape mode
            document = new Document(PageSize.A4.rotate(), 15, 15, 25, 30);
            writer = PdfWriter.getInstance(document, new FileOutputStream(tempFile));

            String formattedNow = LocalDateTime.now().format(DATE_FORMATTER);
            writer.setPageEvent(new PdfFooterPageEvent(formattedNow));
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(30, 58, 138));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.WHITE);
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 7, Color.BLACK);

            Paragraph title = new Paragraph("JKGOVT - SUPER ADMIN GRIEVANCES REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Generated on: " + formattedNow + " | Total Records: " + totalRecords + " | Confidential - JK GOVT", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(10f);
            document.add(subtitle);

            // 4. Setup PDF Table
            String[] headers = {
                    "S.No.",
                    "Grievance ID",
                    "Department",
                    "Category",
                    "Sub Category",
                    "Submitted By",
                    "Mobile",
                    "Submitted On",
                    "Window",
                    "District",
                    "Status",
                    "Priority",
                    "Assigned Dept",
                    "Appeal Status"
            };

            float[] colWidths = {2.5f, 4.5f, 5.5f, 5.5f, 4.5f, 4.5f, 3.5f, 4f, 3f, 3.5f, 3.5f, 3f, 5f, 3.5f};
            PdfPTable table = new PdfPTable(headers.length);
            table.setWidthPercentage(100);
            table.setWidths(colWidths);
            table.setHeaderRows(1);

            Color headerBg = new Color(30, 58, 138);
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setPadding(4f);
                table.addCell(cell);
            }

            // 5. Query records using chunked keyset pagination
            String chunkSql = """
                SELECT 
                    gm.id,
                    gm.uniq_id,
                    COALESCE(dept.name, 'General Administration') AS department,
                    COALESCE(cat.name, 'General Complaints & Petitions') AS category,
                    COALESCE(s1.name, 'NA') AS sub_category,
                    COALESCE(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.middle_name, ''), ' ', COALESCE(u.last_name, ''))), 'CITIZEN USER') AS submitted_by,
                    COALESCE(u.mobile, 'NA') AS mobile_number,
                    gm.created_at AS submitted_on,
                    gm.origin AS window,
                    COALESCE(dist.name, 'NA') AS district,
                    gm.status,
                    COALESCE(gm.key_flag, 'Normal') AS priority,
                    COALESCE(au_latest.department, dept.name, 'NA') AS assigned_department,
                    COALESCE(am_latest.status, 'Not Appealed') AS appeal_status
                FROM jks_3nf.grievance_master gm
                LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                LEFT JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                LEFT JOIN jks_3nf.subcategory_level1 s1 ON s1.id = gm.sub_cat_l1_id
                LEFT JOIN jks_3nf.districts dist ON dist.id = gm.district_id
                LEFT JOIN jks_3nf.users u ON u.id = gm.submitted_by_user_id
                LEFT JOIN LATERAL (
                    SELECT au.department 
                    FROM jks_3nf.assigned_users au 
                    WHERE au.grievance_id = gm.id AND au.enabled = true 
                    ORDER BY au.created_at DESC LIMIT 1
                ) au_latest ON TRUE
                LEFT JOIN LATERAL (
                    SELECT am.status 
                    FROM jks_3nf.appeal_master am 
                    WHERE am.grievance_id = gm.id 
                    ORDER BY am.created_at DESC LIMIT 1
                ) am_latest ON TRUE
                WHERE gm.id > ?
                ORDER BY gm.id ASC
                LIMIT ?
            """;

            long lastId = 0L;
            long processedRecords = 0L;
            int serialNumber = 1;
            int pdfChunkSize = 2000;

            Color altRowColor = new Color(248, 250, 252);

            while (true) {
                if (isCancelled(job)) {
                    logger.info("PDF Job {} was cancelled before fetching next chunk.", jobId);
                    if (document != null && document.isOpen()) {
                        try { document.close(); } catch (Exception ignored) {}
                    }
                    if (tempFile != null && tempFile.exists()) {
                        try { tempFile.delete(); } catch (Exception ignored) {}
                    }
                    return;
                }

                List<Map<String, Object>> rows = jdbcTemplate.queryForList(chunkSql, lastId, pdfChunkSize);
                if (rows.isEmpty()) {
                    break;
                }

                if (isCancelled(job)) {
                    logger.info("PDF Job {} was cancelled after chunk fetch.", jobId);
                    if (document != null && document.isOpen()) {
                        try { document.close(); } catch (Exception ignored) {}
                    }
                    if (tempFile != null && tempFile.exists()) {
                        try { tempFile.delete(); } catch (Exception ignored) {}
                    }
                    return;
                }

                for (Map<String, Object> r : rows) {
                    Color bgColor = (serialNumber % 2 == 0) ? altRowColor : Color.WHITE;

                    addPdfCell(table, String.valueOf(serialNumber++), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("uniq_id")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("department")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("category")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("sub_category")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("submitted_by")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("mobile_number")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, formatDate(r.get("submitted_on")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("window")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("district")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("status")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("priority")), cellFont, bgColor, Element.ALIGN_CENTER);
                    addPdfCell(table, getString(r.get("assigned_department")), cellFont, bgColor, Element.ALIGN_LEFT);
                    addPdfCell(table, getString(r.get("appeal_status")), cellFont, bgColor, Element.ALIGN_CENTER);

                    lastId = ((Number) r.get("id")).longValue();
                    processedRecords++;
                }

                job.setProcessedRecords(processedRecords);
                int progress = totalRecords > 0 ? (int) Math.min(95, (processedRecords * 95) / totalRecords) : 95;
                job.setProgress(progress);
                logger.info("PDF Job {}: Processed {} / {} records ({}%)", jobId, processedRecords, totalRecords, progress);
            }

            if (isCancelled(job)) {
                logger.info("PDF Job {} was cancelled before finalizing document.", jobId);
                if (document != null && document.isOpen()) {
                    try { document.close(); } catch (Exception ignored) {}
                }
                if (tempFile != null && tempFile.exists()) {
                    try { tempFile.delete(); } catch (Exception ignored) {}
                }
                return;
            }

            document.add(table);
            document.close();

            if (isCancelled(job)) {
                logger.info("PDF Job {} was cancelled right after closing document.", jobId);
                if (tempFile != null && tempFile.exists()) {
                    try { tempFile.delete(); } catch (Exception ignored) {}
                }
                return;
            }

            job.setFilePath(tempFile.getAbsolutePath());
            job.setFileName(fileName);
            job.setProgress(100);
            job.setStatus("COMPLETED");
            job.setCompletedAt(LocalDateTime.now());
            logger.info("PDF Job {} successfully COMPLETED. File: {} (size: {} bytes)", jobId, tempFile.getAbsolutePath(), tempFile.length());

        } catch (Exception e) {
            if (job != null && !"CANCELLED".equals(job.getStatus())) {
                logger.error("PDF Job " + jobId + " failed with exception: " + e.getMessage(), e);
                job.setStatus("FAILED");
                job.setErrorMessage(e.getMessage() != null ? e.getMessage() : "Unknown error during PDF export");
            }
            if (document != null && document.isOpen()) {
                try { document.close(); } catch (Exception ignored) {}
            }
            if (tempFile != null && tempFile.exists()) {
                try { tempFile.delete(); } catch (Exception ignored) {}
            }
        }
    }

    public ExportJobStatusDTO getPdfJobStatus(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = pdfJobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("PDF export job not found: " + jobId);
        }

        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to view this export job");
        }

        String downloadUrl = "COMPLETED".equals(job.getStatus())
                ? "/api/super-admin/export/pdf/" + jobId + "/download"
                : null;

        return ExportJobStatusDTO.builder()
                .jobId(job.getJobId())
                .status(job.getStatus())
                .progress(job.getProgress())
                .totalRecords(job.getTotalRecords())
                .processedRecords(job.getProcessedRecords())
                .message("COMPLETED".equals(job.getStatus()) ? "PDF export ready for download" : job.getErrorMessage())
                .downloadUrl(downloadUrl)
                .build();
    }

    public ExportJobStatusDTO cancelPdfExportJob(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = pdfJobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("PDF export job not found: " + jobId);
        }

        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to cancel this export job");
        }

        if ("COMPLETED".equals(job.getStatus())) {
            return ExportJobStatusDTO.builder()
                    .jobId(job.getJobId())
                    .status(job.getStatus())
                    .progress(job.getProgress())
                    .totalRecords(job.getTotalRecords())
                    .processedRecords(job.getProcessedRecords())
                    .message("PDF export job has already completed")
                    .build();
        }

        logger.info("Cancelling PDF export job {} by user {}", jobId, username);
        job.setStatus("CANCELLED");
        job.setErrorMessage("PDF export cancelled by user");

        if (job.getFilePath() != null) {
            try {
                File f = new File(job.getFilePath());
                if (f.exists()) {
                    f.delete();
                }
            } catch (Exception e) {
                logger.warn("Could not delete cancelled PDF export file: {}", e.getMessage());
            }
            job.setFilePath(null);
        }

        return ExportJobStatusDTO.builder()
                .jobId(job.getJobId())
                .status("CANCELLED")
                .progress(job.getProgress())
                .totalRecords(job.getTotalRecords())
                .processedRecords(job.getProcessedRecords())
                .message("PDF export job cancelled successfully")
                .build();
    }

    public Resource getPdfExportFileResource(String jobId, String username, boolean isSuperAdmin) {
        SuperAdminExportJob job = pdfJobRegistry.get(jobId);
        if (job == null) {
            throw new IllegalArgumentException("PDF export job not found: " + jobId);
        }

        if (!isSuperAdmin && !job.getInitiatedBy().equals(username)) {
            throw new AccessDeniedException("You are not authorized to download this export");
        }

        if (!"COMPLETED".equals(job.getStatus())) {
            throw new IllegalStateException("PDF export job is not completed yet (current status: " + job.getStatus() + ")");
        }

        File file = new File(job.getFilePath());
        if (!file.exists()) {
            throw new IllegalStateException("PDF export file no longer exists on server");
        }

        return new FileSystemResource(file);
    }

    public String getPdfExportFileName(String jobId) {
        SuperAdminExportJob job = pdfJobRegistry.get(jobId);
        if (job != null && job.getFileName() != null) {
            return job.getFileName();
        }
        return "SuperAdmin_Grievances_Report_" + LocalDate.now() + ".pdf";
    }

    private void addPdfCell(PdfPTable table, String text, Font font, Color bgColor, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "NA", font));
        cell.setBackgroundColor(bgColor);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(3f);
        table.addCell(cell);
    }

    private static class PdfFooterPageEvent extends PdfPageEventHelper {
        private final Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY);
        private final String timestamp;

        public PdfFooterPageEvent(String timestamp) {
            this.timestamp = timestamp;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(2);
            try {
                footer.setWidths(new float[]{4f, 1f});
                footer.setTotalWidth(document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin());
                footer.setLockedWidth(true);
                footer.getDefaultCell().setFixedHeight(18);
                footer.getDefaultCell().setBorder(Rectangle.TOP);
                footer.getDefaultCell().setBorderColor(Color.LIGHT_GRAY);

                PdfPCell leftCell = new PdfPCell(new Phrase("Generated on: " + timestamp + " | Confidential - J&K Samadhan Super Admin", footerFont));
                leftCell.setBorder(Rectangle.TOP);
                leftCell.setBorderColor(Color.LIGHT_GRAY);
                leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                footer.addCell(leftCell);

                PdfPCell rightCell = new PdfPCell(new Phrase(String.format("Page %d", writer.getPageNumber()), footerFont));
                rightCell.setBorder(Rectangle.TOP);
                rightCell.setBorderColor(Color.LIGHT_GRAY);
                rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                footer.addCell(rightCell);

                footer.writeSelectedRows(0, -1, document.leftMargin(), document.bottomMargin() - 5, writer.getDirectContent());
            } catch (Exception ignored) {}
        }
    }
}
