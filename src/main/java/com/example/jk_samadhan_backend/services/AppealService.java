package com.example.jk_samadhan_backend.services;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.jk_samadhan_backend.dto.AppealDTO;
import com.example.jk_samadhan_backend.dto.AppealSummaryDTO;
import com.example.jk_samadhan_backend.dto.AppealDashboardSummaryDTO;
import com.example.jk_samadhan_backend.dto.AppealDashboardRowDTO;
import com.example.jk_samadhan_backend.dto.PaginatedAppealsResponseDTO;
import com.example.jk_samadhan_backend.models.AppealMaster;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.repositories.AppealMasterRepository;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;
import com.example.jk_samadhan_backend.repositories.AppealSpecification;

@Service
public class AppealService {

    private final UserRepository userRepository;
    private final GrievanceMasterRepository grievanceMasterRepository;
    private final AppealMasterRepository appealMasterRepository;

    public AppealService(UserRepository userRepository,
                         GrievanceMasterRepository grievanceMasterRepository,
                         AppealMasterRepository appealMasterRepository) {
        this.userRepository = userRepository;
        this.grievanceMasterRepository = grievanceMasterRepository;
        this.appealMasterRepository = appealMasterRepository;
    }

    @Transactional(readOnly = true)
    public AppealDashboardSummaryDTO getAppealDashboardSummary(Principal principal) {
        Users user = userRepository.findByIdentifier(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer departmentId = null;
        Integer districtId = null;
        Long appealedToId = null;

        String role = user.getRole();
        if (user.getUserType() != null && user.getUserType().getTypeName() != null) {
            role = user.getUserType().getTypeName();
        }
        String roleUpper = role.toUpperCase();

        boolean isGlobalAdmin = roleUpper.contains("SUPERADMIN")
                || roleUpper.contains("SECRETARY")
                || "superadmin".equalsIgnoreCase(user.getUsername())
                || (user.getUserType() != null && "ROLE_SuperAdmin".equalsIgnoreCase(user.getUserType().getTypeName()));

        if (isGlobalAdmin) {
            // Global scopes remain null
        } else if (roleUpper.contains("DEPT") || roleUpper.contains("ADMIN")) {
            departmentId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        } else if (roleUpper.contains("DM")) {
            districtId = user.getDistrictEntity() != null ? user.getDistrictEntity().getId() : null;
        } else if (roleUpper.contains("APPELLATE")) {
            appealedToId = user.getId();
        }

        Specification<AppealMaster> spec = AppealSpecification.getAppealsSpec(null, departmentId, districtId, appealedToId);
        long totalAppeals = appealMasterRepository.count(spec);
        long appealDisposed = countByStatus("Resolved", departmentId, districtId, appealedToId);
        long appealsRejected = countByStatus("Rejected", departmentId, districtId, appealedToId);
        long appealsPending = countByStatus("Appealed", departmentId, districtId, appealedToId);
        long appealsUnderProcess = countByStatus("Appeal Forwarded", departmentId, districtId, appealedToId);
        long remarksReceived = countByStatus("Remark Recieved", departmentId, districtId, appealedToId);

        long appealsOpen = appealsPending + appealsUnderProcess;
        long appealsClosed = appealDisposed + appealsRejected;
        double disposalPercentage = totalAppeals == 0 ? 0.0 : ((double) appealsClosed * 100.0) / totalAppeals;
        // Format to 2 decimal places
        disposalPercentage = Math.round(disposalPercentage * 100.0) / 100.0;

        return AppealDashboardSummaryDTO.builder()
                .totalAppeals(totalAppeals)
                .appealDisposed(appealDisposed)
                .appealsRejected(appealsRejected)
                .appealsPending(appealsPending)
                .appealsUnderProcess(appealsUnderProcess)
                .appealsOpen(appealsOpen)
                .appealsClosed(appealsClosed)
                .disposalPercentage(disposalPercentage)
                .remarksReceived(remarksReceived)
                .build();
    }

    private long countByStatus(String status, Integer departmentId, Integer districtId, Long appealedToId) {
        Specification<AppealMaster> spec = AppealSpecification.getAppealsSpec(null, departmentId, districtId, appealedToId);
        Specification<AppealMaster> statusSpec = (root, query, cb) -> cb.equal(root.get("status"), status);
        return appealMasterRepository.count(Specification.where(spec).and(statusSpec));
    }

    @Transactional(readOnly = true)
    public PaginatedAppealsResponseDTO getAppealDashboardList(String search, Principal principal, Pageable pageable) {
        Users user = userRepository.findByIdentifier(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer departmentId = null;
        Integer districtId = null;
        Long appealedToId = null;

        String role = user.getRole();
        if (user.getUserType() != null && user.getUserType().getTypeName() != null) {
            role = user.getUserType().getTypeName();
        }
        String roleUpper = role.toUpperCase();

        boolean isGlobalAdmin = roleUpper.contains("SUPERADMIN")
                || roleUpper.contains("SECRETARY")
                || "superadmin".equalsIgnoreCase(user.getUsername())
                || (user.getUserType() != null && "ROLE_SuperAdmin".equalsIgnoreCase(user.getUserType().getTypeName()));

        if (isGlobalAdmin) {
            // Global scopes remain null
        } else if (roleUpper.contains("DEPT") || roleUpper.contains("ADMIN")) {
            departmentId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        } else if (roleUpper.contains("DM")) {
            districtId = user.getDistrictEntity() != null ? user.getDistrictEntity().getId() : null;
        } else if (roleUpper.contains("APPELLATE")) {
            appealedToId = user.getId();
        }

        Specification<AppealMaster> spec = AppealSpecification.getAppealsSpec(search, departmentId, districtId, appealedToId);
        Page<AppealMaster> pageResult = appealMasterRepository.findAll(spec, pageable);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<AppealDashboardRowDTO> content = pageResult.getContent().stream()
                .map(a -> {
                    String department = "General Administration";
                    if (a.getGrievance() != null && a.getGrievance().getCategory() != null && a.getGrievance().getCategory().getDepartment() != null) {
                        department = a.getGrievance().getCategory().getDepartment().getName();
                    }
                    String officeName = a.getSubmittedBy() != null ? a.getSubmittedBy().getOfficeName() : "";
                    if (officeName == null || officeName.isBlank()) {
                        officeName = "Secretariat Office";
                    }
                    String dateOfAction = a.getUpdatedAt() != null ? a.getUpdatedAt().format(formatter) : "";
                    String actionTakenBy = a.getResolvedBy() != null ? a.getResolvedBy().getName() : "System Admin";
                    String grievanceForwardedTo = a.getAppealedTo() != null ? a.getAppealedTo().getName() : "Nodal Officer";

                    return AppealDashboardRowDTO.builder()
                            .id(a.getId())
                            .department(department)
                            .officeName(officeName)
                            .grievanceUniqId(a.getGrievance() != null ? a.getGrievance().getUniqId() : "")
                            .appealUniqId(a.getAppealUniqId())
                            .dateOfAction(dateOfAction)
                            .actionTaken(a.getStatus())
                            .actionTakenBy(actionTakenBy)
                            .grievanceForwardedTo(grievanceForwardedTo)
                            .remark(a.getDescription())
                            .status(a.getStatus())
                            .build();
                })
                .collect(Collectors.toList());

        return PaginatedAppealsResponseDTO.builder()
                .content(content)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .currentPage(pageResult.getNumber())
                .build();
    }

    @Transactional
    public AppealSummaryDTO lodgeAppeal(AppealDTO appealDTO, Principal principal) {
        Users user = userRepository.findByIdentifier(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GrievanceMaster grievance = grievanceMasterRepository.findById(appealDTO.getGrievanceId())
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        String generatedUniqId = "APL" + java.time.Year.now().getValue() + "/" + (100000 + new java.util.Random().nextInt(900000));

        // Find Appellate Nodal Officer for the department
        Users appealedTo = null;
        if (grievance.getCategory() != null && grievance.getCategory().getDepartment() != null) {
            Integer deptId = grievance.getCategory().getDepartment().getId();
            List<Users> appellateUsers = userRepository.findAppellateByDepartment(deptId);
            if (!appellateUsers.isEmpty()) {
                appealedTo = appellateUsers.get(0);
            }
        }

        // Fallback to any Appellate Nodal if department specific is not found
        if (appealedTo == null) {
            List<Users> allAppellates = userRepository.findAllAppellates();
            if (!allAppellates.isEmpty()) {
                appealedTo = allAppellates.get(0);
            } else {
                // If no appellate exists, assign to superadmin/first user
                appealedTo = userRepository.findById(1L).orElse(user);
            }
        }

        AppealMaster appeal = new AppealMaster();
        appeal.setAppealUniqId(generatedUniqId);
        appeal.setGrievance(grievance);
        appeal.setDescription(appealDTO.getDescription());
        appeal.setFileName(appealDTO.getFileName());
        appeal.setFilePath(appealDTO.getFilePath());
        appeal.setAppealedTo(appealedTo);
        appeal.setSubmittedBy(user);
        appeal.setStatus("Appealed");

        // Save Appeal
        AppealMaster savedAppeal = appealMasterRepository.save(appeal);

        // Update grievance status to Appealed
        grievance.setStatus("Appealed");
        grievanceMasterRepository.save(grievance);

        return AppealSummaryDTO.builder()
                .id(savedAppeal.getId())
                .appealUniqId(savedAppeal.getAppealUniqId())
                .grievanceUniqId(savedAppeal.getGrievance() != null ? savedAppeal.getGrievance().getUniqId() : "NA")
                .description(savedAppeal.getDescription())
                .status(savedAppeal.getStatus())
                .appealedTo(savedAppeal.getAppealedTo() != null ? savedAppeal.getAppealedTo().getName() : "NA")
                .resolvedBy(savedAppeal.getResolvedBy() != null ? savedAppeal.getResolvedBy().getName() : "NA")
                .submittedBy(savedAppeal.getSubmittedBy() != null ? savedAppeal.getSubmittedBy().getName() : "NA")
                .createdAt(savedAppeal.getCreatedAt() != null ? savedAppeal.getCreatedAt().toString() : java.time.LocalDateTime.now().toString())
                .build();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public com.example.jk_samadhan_backend.dto.PaginatedAppealMisReportResponseDTO getAppealMisReport(
            String search, Integer deptId, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<com.example.jk_samadhan_backend.dto.AppealMisReportProjection> pageResult =
                appealMasterRepository.findAppealCountsByDepartment(search, deptId != null ? deptId : 0, pageable);

        return com.example.jk_samadhan_backend.dto.PaginatedAppealMisReportResponseDTO.builder()
                .content(pageResult.getContent())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .currentPage(pageResult.getNumber() + 1)
                .build();
    }
}
