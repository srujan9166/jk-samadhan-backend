package com.example.jk_samadhan_backend.controllers;

import com.example.jk_samadhan_backend.dto.ExportJobStatusDTO;
import com.example.jk_samadhan_backend.dto.PaginatedGrievancesResponseDTO;
import com.example.jk_samadhan_backend.dto.SuperAdminSummaryDTO;
import com.example.jk_samadhan_backend.services.GrievanceService;
import com.example.jk_samadhan_backend.services.SuperAdminExportService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping({"/api/super-admin", "/api/superadmin"})
public class SuperAdminController {

    private final GrievanceService grievanceService;
    private final SuperAdminExportService superAdminExportService;

    public SuperAdminController(GrievanceService grievanceService, SuperAdminExportService superAdminExportService) {
        this.grievanceService = grievanceService;
        this.superAdminExportService = superAdminExportService;
    }

    @GetMapping("/grievances")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getGrievances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String subCatL2,
            @RequestParam(required = false) String subCatL3,
            @RequestParam(required = false) String subCatL4,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String finalStatus,
            @RequestParam(required = false) String keyFlag) {

        String mappedSortBy = sortBy;
        if ("grievanceId".equalsIgnoreCase(sortBy)) {
            mappedSortBy = "uniqId";
        }

        Sort.Direction direction = Sort.Direction.DESC;
        try {
            direction = Sort.Direction.fromString(sortDirection);
        } catch (Exception e) {
            // fallback to DESC
        }

        Sort sort = Sort.by(direction, mappedSortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        PaginatedGrievancesResponseDTO response = grievanceService.getSuperAdminGrievances(
                search, status, department, district, category, dateFrom, dateTo,
                subCategory, subCatL2, subCatL3, subCatL4, origin, finalStatus, keyFlag, pageRequest);
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<SuperAdminSummaryDTO> getAnalyticsSummary(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String subCatL2,
            @RequestParam(required = false) String subCatL3,
            @RequestParam(required = false) String subCatL4,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String finalStatus,
            @RequestParam(required = false) String keyFlag) {

        SuperAdminSummaryDTO summary = grievanceService.getSuperAdminAnalyticsSummary(
                search, status, department, district, category, dateFrom, dateTo,
                subCategory, subCatL2, subCatL3, subCatL4, origin, finalStatus, keyFlag);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<SuperAdminSummaryDTO> getDashboardSummary() {
        SuperAdminSummaryDTO summary = grievanceService.getSuperAdminDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/createOfficialUser")
    public ResponseEntity<java.util.Map<String, String>> createOfficialUser(@RequestBody com.example.jk_samadhan_backend.dto.CreateUserReqDTO payload) {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        try {
            grievanceService.createOfficialUser(payload);
            response.put("statusCode", "1");
            response.put("statusName", "Success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("statusCode", "4");
            response.put("statusName", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/getCitizenList")
    public ResponseEntity<Map<String, Object>> getCitizenList(@RequestBody Map<String, Object> params) {
        int start = params.get("start") != null ? ((Number) params.get("start")).intValue() : 0;
        int length = params.get("length") != null ? ((Number) params.get("length")).intValue() : 10;
        
        String search = "";
        Object searchParam = params.get("search");
        if (searchParam instanceof Map) {
            search = (String) ((Map) searchParam).getOrDefault("value", "");
        } else if (searchParam instanceof String) {
            search = (String) searchParam;
        }

        String district = (String) params.get("districtFilterVal");
        String dateFrom = (String) params.get("fdFilterVal");
        String dateTo = (String) params.get("tdFilterVal");
        String gender = (String) params.get("filterValue");

        Integer blockId = parseId(params.get("blockId"));
        Integer panchayatId = parseId(params.get("panchayatId"));
        Integer municipalityId = parseId(params.get("municipalityId"));
        Integer wardId = parseId(params.get("wardId"));

        // Parse sorting
        String orderColumn = "created_date";
        String orderDirection = "DESC";
        Object orderParam = params.get("order");
        if (orderParam instanceof List && !((List<?>) orderParam).isEmpty()) {
            Map orderDetails = (Map) ((List<?>) orderParam).get(0);
            int columnIndex = orderDetails.get("column") != null ? ((Number) orderDetails.get("column")).intValue() : 0;
            orderDirection = orderDetails.get("dir") != null ? (String) orderDetails.get("dir") : "DESC";

            Object columnsParam = params.get("columns");
            if (columnsParam instanceof List && columnIndex < ((List<?>) columnsParam).size()) {
                Map columnDetails = (Map) ((List<?>) columnsParam).get(columnIndex);
                orderColumn = (String) columnDetails.getOrDefault("data", "created_date");
            }
        }

        Map<String, Object> result = grievanceService.getCitizenListReport(
                start, length, search, district, dateFrom, dateTo, gender, orderColumn, orderDirection,
                blockId, panchayatId, municipalityId, wardId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/loadMisCitizen")
    public ResponseEntity<Map<String, Object>> loadMisCitizen() {
        Map<String, Object> result = grievanceService.getCitizenDivisionReport();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/loadMisDistrict")
    public ResponseEntity<Map<String, Object>> loadMisDistrict(@RequestBody Map<String, Object> params) {
        int start = params.get("start") != null ? ((Number) params.get("start")).intValue() : 0;
        int length = params.get("length") != null ? ((Number) params.get("length")).intValue() : 10;
        
        String search = "";
        Object searchParam = params.get("search");
        if (searchParam instanceof Map) {
            search = (String) ((Map) searchParam).getOrDefault("value", "");
        } else if (searchParam instanceof String) {
            search = (String) searchParam;
        }

        String state = params.get("state") != null ? (String) params.get("state") : "0";
        String district = params.get("district") != null ? (String) params.get("district") : "0";

        Map<String, Object> result = grievanceService.getCitizenDistrictReport(start, length, search, state, district);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/jkigrams/summary")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.JkigramsDTO.Summary> getJkigramsSummary() {
        com.example.jk_samadhan_backend.dto.JkigramsDTO.Summary summary = grievanceService.getJkigramsSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/jkigrams/grievances")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.JkigramsDTO.PaginatedResponse> getJkigramsGrievances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String category) {

        Sort.Direction direction = Sort.Direction.DESC;
        try {
            direction = Sort.Direction.fromString(sortDirection);
        } catch (Exception ignored) {}

        String sortProp = "id";
        if ("referenceId".equalsIgnoreCase(sortBy) || "reference_id".equalsIgnoreCase(sortBy)) {
            sortProp = "referenceId";
        } else if ("applicationDate".equalsIgnoreCase(sortBy) || "submittedOn".equalsIgnoreCase(sortBy)) {
            sortProp = "applicationDate";
        } else if ("applicantName".equalsIgnoreCase(sortBy)) {
            sortProp = "applicantName";
        } else if ("grievanceType".equalsIgnoreCase(sortBy) || "category".equalsIgnoreCase(sortBy)) {
            sortProp = "grievanceType";
        }

        Sort sort = Sort.by(direction, sortProp);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        com.example.jk_samadhan_backend.dto.JkigramsDTO.PaginatedResponse response =
                grievanceService.getJkigramsGrievances(search, status, department, category, pageRequest);

        return ResponseEntity.ok(response);
    }

    private Integer parseId(Object val) {
        if (val == null) return null;
        if (val instanceof Number n) return n.intValue();
        if (val instanceof String s && !s.trim().isEmpty()) {
            try {
                return Integer.parseInt(s.trim());
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    // ==========================================
    // Super Admin Complete Excel Export (Asynchronous)
    // ==========================================

    @PostMapping({"/export/excel"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> startExcelExport(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ExportJobStatusDTO response = superAdminExportService.startExcelExport(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/excel/{jobId}/status"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> getExportStatus(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        ExportJobStatusDTO response = superAdminExportService.getJobStatus(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/export/excel/{jobId}/cancel"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> cancelExcelExport(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        ExportJobStatusDTO response = superAdminExportService.cancelExportJob(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/excel/{jobId}/download"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Resource> downloadExportExcel(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        Resource resource = superAdminExportService.getExportFileResource(jobId, principal.getName(), isSuperAdmin);
        String fileName = superAdminExportService.getExportFileName(jobId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    // ==========================================
    // Super Admin Complete PDF Export (Asynchronous)
    // ==========================================

    @PostMapping({"/export/pdf"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> startPdfExport(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ExportJobStatusDTO response = superAdminExportService.startPdfExport(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/pdf/{jobId}/status"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> getPdfExportStatus(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        ExportJobStatusDTO response = superAdminExportService.getPdfJobStatus(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/export/pdf/{jobId}/cancel"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ExportJobStatusDTO> cancelPdfExport(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        ExportJobStatusDTO response = superAdminExportService.cancelPdfExportJob(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/pdf/{jobId}/download"})
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'SUPERADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Resource> downloadExportPdf(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("SUPERADMIN") || a.getAuthority().toUpperCase().contains("SUPER_ADMIN"));
        Resource resource = superAdminExportService.getPdfExportFileResource(jobId, principal.getName(), isSuperAdmin);
        String fileName = superAdminExportService.getPdfExportFileName(jobId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
}
