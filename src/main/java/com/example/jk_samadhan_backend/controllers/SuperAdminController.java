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
    private final com.example.jk_samadhan_backend.services.FeedbackService feedbackService;
    private final com.example.jk_samadhan_backend.repositories.UserRepository userRepository;

    public SuperAdminController(GrievanceService grievanceService,
                                SuperAdminExportService superAdminExportService,
                                com.example.jk_samadhan_backend.services.FeedbackService feedbackService,
                                com.example.jk_samadhan_backend.repositories.UserRepository userRepository) {
        this.grievanceService = grievanceService;
        this.superAdminExportService = superAdminExportService;
        this.feedbackService = feedbackService;
        this.userRepository = userRepository;
    }

    private String resolveDistrictForPrincipal(Principal principal, String inputDistrict) {
        if (principal == null) return inputDistrict;
        try {
            String identifier = principal.getName();
            com.example.jk_samadhan_backend.models.Users user = null;
            try {
                user = userRepository.findByUuid(java.util.UUID.fromString(identifier)).orElse(null);
            } catch (Exception e) {
            }
            if (user == null) {
                user = userRepository.findByIdentifier(identifier).orElse(null);
            }
            if (user != null) {
                String role = (user.getUserType() != null && user.getUserType().getTypeName() != null)
                        ? user.getUserType().getTypeName()
                        : (user.getRole() != null ? user.getRole() : "");
                if (role.toUpperCase().contains("DM") || role.toUpperCase().contains("DISTRICT")) {
                    if (user.getDistrictEntity() != null && user.getDistrictEntity().getName() != null && !user.getDistrictEntity().getName().isBlank()) {
                        return user.getDistrictEntity().getName();
                    } else if (user.getDistrict() != null && !user.getDistrict().isBlank() && !"Other".equalsIgnoreCase(user.getDistrict())) {
                        return user.getDistrict();
                    }
                }
            }
        } catch (Exception e) {
        }
        return inputDistrict;
    }

    private String resolveOriginForPrincipal(Principal principal, String inputOrigin) {
        if (principal == null) return inputOrigin;
        try {
            String identifier = principal.getName();
            com.example.jk_samadhan_backend.models.Users user = null;
            try {
                user = userRepository.findByUuid(java.util.UUID.fromString(identifier)).orElse(null);
            } catch (Exception e) {
            }
            if (user == null) {
                user = userRepository.findByIdentifier(identifier).orElse(null);
            }
            if (user != null) {
                String role = (user.getUserType() != null && user.getUserType().getTypeName() != null)
                        ? user.getUserType().getTypeName()
                        : (user.getRole() != null ? user.getRole() : "");
                String r = role.toUpperCase();
                if (r.contains("RAABITA") || r.contains("RMC")) {
                    return "RAABITA";
                }
            }
        } catch (Exception e) {
        }
        return inputOrigin;
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
            @RequestParam(required = false) String keyFlag,
            Principal principal) {

        String targetDistrict = resolveDistrictForPrincipal(principal, district);
        String targetOrigin = resolveOriginForPrincipal(principal, origin);

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
                search, status, department, targetDistrict, category, dateFrom, dateTo,
                subCategory, subCatL2, subCatL3, subCatL4, targetOrigin, finalStatus, keyFlag, pageRequest);
                
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
            @RequestParam(required = false) String keyFlag,
            Principal principal) {

        String targetDistrict = resolveDistrictForPrincipal(principal, district);
        String targetOrigin = resolveOriginForPrincipal(principal, origin);

        SuperAdminSummaryDTO summary = grievanceService.getSuperAdminAnalyticsSummary(
                search, status, department, targetDistrict, category, dateFrom, dateTo,
                subCategory, subCatL2, subCatL3, subCatL4, targetOrigin, finalStatus, keyFlag);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<SuperAdminSummaryDTO> getDashboardSummary(Principal principal) {
        SuperAdminSummaryDTO summary = grievanceService.getSuperAdminDashboardSummary(principal);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/status-wise-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO> getStatusWiseReport(
            @RequestParam(defaultValue = "department") String mode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO response =
                grievanceService.getStatusWiseReport(mode, page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/district-wise-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedDistrictWiseReportDTO> getDistrictWiseReport(
            @RequestParam(defaultValue = "JKSAMADHAN") String origin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        com.example.jk_samadhan_backend.dto.PaginatedDistrictWiseReportDTO response =
                grievanceService.getDistrictWiseReport(origin, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/district-wise-report/details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getDistrictWiseReportDetails(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        PaginatedGrievancesResponseDTO response =
                grievanceService.getDistrictWiseReportDetails(district, origin, status, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/heatmap")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedHeatmapDTO> getHeatmapReport(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String statusCategory,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        com.example.jk_samadhan_backend.dto.PaginatedHeatmapDTO response =
                grievanceService.getHeatmapReport(dateFrom, dateTo, department, category, status, statusCategory, origin, district, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/average-time-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedAverageTimeTakenReportDTO> getAverageTimeReport(
            @RequestParam(defaultValue = "department") String mode,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        com.example.jk_samadhan_backend.dto.PaginatedAverageTimeTakenReportDTO response =
                grievanceService.getAverageTimeTakenReport(mode, department, district, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/average-time-report/details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getAverageTimeReportDetails(
            @RequestParam(defaultValue = "department") String mode,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        PaginatedGrievancesResponseDTO response =
                grievanceService.getAverageTimeTakenDetails(mode, name, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appellate-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedAppellateReportDTO> getAppellateReport(
            @RequestParam(required = false) String departmentType,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        com.example.jk_samadhan_backend.dto.PaginatedAppellateReportDTO response =
                grievanceService.getAppellateReport(departmentType, fromDate, toDate, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appellate-report/details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getAppellateReportDetails(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        PaginatedGrievancesResponseDTO response =
                grievanceService.getAppellateReportDetails(department, type, fromDate, toDate, page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/advance-query", "/reportAdvanced"})
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedAdvanceQueryDTO> executeAdvanceQuery(
            @RequestBody com.example.jk_samadhan_backend.dto.AdvanceQueryRequestDTO request,
            Principal principal) {
        com.example.jk_samadhan_backend.dto.PaginatedAdvanceQueryDTO response =
                grievanceService.executeAdvanceQuery(request, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status-wise-report/details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getStatusWiseGrievanceDetailsModal(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedGrievancesResponseDTO response =
                grievanceService.getStatusWiseGrievanceDetailsModal(department, username, status, page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/department-users")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedDepartmentUserReportDTO> getDepartmentUserReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String departmentType,
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String district) {
        com.example.jk_samadhan_backend.dto.PaginatedDepartmentUserReportDTO response = 
                grievanceService.getDepartmentUserReport(page, size, search, department, departmentType, userType, district);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dealing-hand-grievances")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedDealingHandReportDTO> getDealingHandReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        com.example.jk_samadhan_backend.dto.PaginatedDealingHandReportDTO response = grievanceService.getDealingHandReport(page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dealing-hand-grievances/user-details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getDealingHandGrievancesModal(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedGrievancesResponseDTO response = grievanceService.getDealingHandGrievancesModal(username, page, size, search);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/createOfficialUser")
    public ResponseEntity<java.util.Map<String, String>> createOfficialUser(
            @RequestBody com.example.jk_samadhan_backend.dto.CreateUserReqDTO payload,
            java.security.Principal principal) {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        try {
            grievanceService.createOfficialUser(payload, principal);
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
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> startExcelExport(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ExportJobStatusDTO response = superAdminExportService.startExcelExport(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/excel/{jobId}/status"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> getExportStatus(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
        ExportJobStatusDTO response = superAdminExportService.getJobStatus(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/export/excel/{jobId}/cancel"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> cancelExcelExport(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
        ExportJobStatusDTO response = superAdminExportService.cancelExportJob(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/excel/{jobId}/download"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<Resource> downloadExportExcel(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
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
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> startPdfExport(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ExportJobStatusDTO response = superAdminExportService.startPdfExport(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/pdf/{jobId}/status"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> getPdfExportStatus(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
        ExportJobStatusDTO response = superAdminExportService.getPdfJobStatus(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/export/pdf/{jobId}/cancel"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<ExportJobStatusDTO> cancelPdfExport(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
        ExportJobStatusDTO response = superAdminExportService.cancelPdfExportJob(jobId, principal.getName(), isSuperAdmin);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/export/pdf/{jobId}/download"})
    @PreAuthorize("hasAuthority('ROLE_SuperAdmin')")
    public ResponseEntity<Resource> downloadExportPdf(@PathVariable String jobId, Principal principal, Authentication auth) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isSuperAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_SuperAdmin"));
        Resource resource = superAdminExportService.getPdfExportFileResource(jobId, principal.getName(), isSuperAdmin);
        String fileName = superAdminExportService.getPdfExportFileName(jobId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @GetMapping("/tree/departments")
    public ResponseEntity<List<Map<String, Object>>> getTreeDepartments() {
        return ResponseEntity.ok(grievanceService.getTreeDepartments());
    }

    @GetMapping("/tree/mainCategories")
    public ResponseEntity<List<Map<String, Object>>> getTreeMainCategories(@RequestParam(required = false) String departmentName) {
        return ResponseEntity.ok(grievanceService.getTreeMainCategories(departmentName));
    }

    @GetMapping("/tree/subCategories")
    public ResponseEntity<List<Map<String, Object>>> getTreeSubCategoriesL1(
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) String categoryName) {
        return ResponseEntity.ok(grievanceService.getTreeSubCategoriesL1(departmentName, categoryName));
    }

    @GetMapping("/tree/grievances")
    public ResponseEntity<List<Map<String, Object>>> getTreeGrievances(
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String subCategoryName) {
        return ResponseEntity.ok(grievanceService.getTreeGrievanceList(departmentName, categoryName, subCategoryName));
    }

    @GetMapping("/pendency-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO> getPendencyReport(
            @RequestParam(defaultValue = "userwise") String mode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        String normalizedMode = (mode != null && (mode.equalsIgnoreCase("userwise") || mode.equalsIgnoreCase("user"))) ? "user" : "department";
        com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO response =
                grievanceService.getStatusWiseReport(normalizedMode, page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pendency-report/details")
    public ResponseEntity<PaginatedGrievancesResponseDTO> getPendencyGrievanceDetailsModal(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedGrievancesResponseDTO response =
                grievanceService.getStatusWiseGrievanceDetailsModal(department, username, status != null ? status : "Pending", page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/feedback/summary")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.FeedbackSummaryDTO> getFeedbackSummary(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String satisfaction,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        return ResponseEntity.ok(feedbackService.getFeedbackSummary(
                department, district, category, gender, satisfaction, dateFrom, dateTo));
    }

    @GetMapping("/feedback/list")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedFeedbackResponseDTO> getFeedbackList(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String satisfaction,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(feedbackService.getFeedbackList(
                department, district, category, gender, satisfaction, dateFrom, dateTo, search, page, size));
    }

    @GetMapping("/feedback/mis-report")
    public ResponseEntity<List<com.example.jk_samadhan_backend.dto.FeedbackMisReportDTO>> getFeedbackMisReport(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo) {
        return ResponseEntity.ok(feedbackService.getFeedbackMisReport(department, district, dateFrom, dateTo));
    }
}
