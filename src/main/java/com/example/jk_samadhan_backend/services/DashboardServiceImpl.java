package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.*;
import com.example.jk_samadhan_backend.models.*;
import com.example.jk_samadhan_backend.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final GrievanceMasterRepository grievanceMasterRepository;
    private final CpgramGrievanceMasterRepository cpgramGrievanceMasterRepository;
    private final AppealMasterRepository appealMasterRepository;
    private final GrievanceHistoryRepository grievanceHistoryRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                GrievanceMasterRepository grievanceMasterRepository,
                                CpgramGrievanceMasterRepository cpgramGrievanceMasterRepository,
                                AppealMasterRepository appealMasterRepository,
                                GrievanceHistoryRepository grievanceHistoryRepository) {
        this.userRepository = userRepository;
        this.grievanceMasterRepository = grievanceMasterRepository;
        this.cpgramGrievanceMasterRepository = cpgramGrievanceMasterRepository;
        this.appealMasterRepository = appealMasterRepository;
        this.grievanceHistoryRepository = grievanceHistoryRepository;
    }

    @Override
    public DashboardResponseDTO getDashboardData(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthenticated user");
        }

        // 1. Resolve User
        String identifier = principal.getName();
        Users user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier));

        // 2. Resolve Role and Org Entity Limits
        String role = "ROLE_Individual";
        Integer userLevel = 0;
        if (user.getUserType() != null) {
            role = user.getUserType().getTypeName();
            userLevel = user.getUserType().getUserLevel();
        } else if (user.getRole() != null) {
            role = user.getRole();
        }

        Department department = user.getDepartment();
        District district = user.getDistrictEntity();

        // 3. Populate User Information DTO
        UserInfoDTO userInfoDTO = UserInfoDTO.builder()
                .username(user.getUsername())
                .fullName(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .officeName(user.getOfficeName())
                .department(department != null ? department.getName() : "NA")
                .userType(role)
                .userLevel(userLevel)
                .build();

        // 4. Initialize counts variables
        long jkTotal = 0, jkPending = 0, jkResolved = 0, jkRejected = 0, jkForwarded = 0, jkClosed = 0, jkPriority = 0, jkNormal = 0, jkUrgent = 0, jkInProgress = 0, jkDoesNotPertain = 0;
        long cpTotal = 0, cpPending = 0, cpResolved = 0, cpRejected = 0, cpClosed = 0;

        List<GrievanceProjection> jkGrievancesList = new ArrayList<>();
        List<CpgramGrievanceMaster> cpGrievancesList = new ArrayList<>();
        List<AppealMaster> appealList = new ArrayList<>();
        List<GrievanceHistory> historyList = new ArrayList<>();

        // 5. Query data based on Role / Scope
        if (role.equalsIgnoreCase("ROLE_SuperAdmin") || role.equalsIgnoreCase("ROLE_Admin") || role.toUpperCase().contains("SUPERADMIN") || role.toUpperCase().contains("ADMIN")) {
            // Global scope
            jkTotal = grievanceMasterRepository.count();
            jkPending = grievanceMasterRepository.countByStatus("Registered") + grievanceMasterRepository.countByStatus("Pending");
            jkResolved = grievanceMasterRepository.countByStatus("Resolved");
            jkRejected = grievanceMasterRepository.countByStatus("Rejected");
            jkForwarded = grievanceMasterRepository.countByStatus("Forwarded");
            jkClosed = grievanceMasterRepository.countByStatus("Closed") + jkResolved + jkRejected;
            jkPriority = grievanceMasterRepository.countByKeyFlag("Priority");
            jkNormal = grievanceMasterRepository.countByKeyFlag("Normal");
            jkUrgent = grievanceMasterRepository.countByKeyFlag("Urgent");
            jkInProgress = grievanceMasterRepository.countByStatus("In Progress");
            jkDoesNotPertain = grievanceMasterRepository.countByStatus("Does Not Pertain");

            cpTotal = cpgramGrievanceMasterRepository.countAll();
            cpPending = cpgramGrievanceMasterRepository.countByStatus("Pending");
            cpResolved = cpgramGrievanceMasterRepository.countByStatus("Resolved") + cpgramGrievanceMasterRepository.countByStatus("Case Closed") + cpgramGrievanceMasterRepository.countByStatus("Closed");
            cpRejected = cpgramGrievanceMasterRepository.countByStatus("Rejected");
            cpClosed = cpResolved;

            PageRequest pageRequest = PageRequest.of(0, 150000, Sort.by("id").descending());
            jkGrievancesList = grievanceMasterRepository.findAllProjections(pageRequest);
            cpGrievancesList = cpgramGrievanceMasterRepository.findAll();
            appealList = appealMasterRepository.findAll();
            historyList = grievanceHistoryRepository.findTop10ByOrderByCreatedAtDesc();

        } else if (role.equalsIgnoreCase("ROLE_Secretary") || role.equalsIgnoreCase("ROLE_Department")) {
            // Department scope
            if (department != null) {
                Integer deptId = department.getId();
                String deptName = department.getName();

                jkTotal = grievanceMasterRepository.countByDepartmentId(deptId);
                jkPending = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Registered") + grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Pending");
                jkResolved = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Resolved");
                jkRejected = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Rejected");
                jkForwarded = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Forwarded");
                jkClosed = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Closed") + jkResolved + jkRejected;
                jkPriority = grievanceMasterRepository.countByDepartmentIdAndKeyFlag(deptId, "Priority");
                jkNormal = grievanceMasterRepository.countByDepartmentIdAndKeyFlag(deptId, "Normal");
                jkUrgent = grievanceMasterRepository.countByDepartmentIdAndKeyFlag(deptId, "Urgent");
                jkInProgress = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "In Progress");
                jkDoesNotPertain = grievanceMasterRepository.countByDepartmentIdAndStatus(deptId, "Does Not Pertain");

                cpTotal = cpgramGrievanceMasterRepository.countByForwardedDepartment(deptName);
                cpPending = cpgramGrievanceMasterRepository.countByForwardedDepartmentAndStatus(deptName, "Pending");
                cpResolved = cpgramGrievanceMasterRepository.countByForwardedDepartmentAndStatus(deptName, "Resolved") + cpgramGrievanceMasterRepository.countByForwardedDepartmentAndStatus(deptName, "Case Closed") + cpgramGrievanceMasterRepository.countByForwardedDepartmentAndStatus(deptName, "Closed");
                cpRejected = cpgramGrievanceMasterRepository.countByForwardedDepartmentAndStatus(deptName, "Rejected");
                cpClosed = cpResolved;

                PageRequest pageRequest = PageRequest.of(0, 2000, Sort.by("id").descending());
                jkGrievancesList = grievanceMasterRepository.findProjectionsByDepartmentId(deptId, pageRequest);
                cpGrievancesList = cpgramGrievanceMasterRepository.findByForwardedDepartment(deptName);
                appealList = appealMasterRepository.findByDepartmentId(deptId);
                historyList = grievanceHistoryRepository.findTop10ByGrievanceCategoryDepartmentIdOrderByCreatedAtDesc(deptId);
            }

        } else if (role.equalsIgnoreCase("ROLE_DM")) {
            // District scope
            if (district != null) {
                Integer distId = district.getId();
                String distName = district.getName();

                jkTotal = grievanceMasterRepository.countByDistrictId(distId);
                jkPending = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Registered") + grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Pending");
                jkResolved = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Resolved");
                jkRejected = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Rejected");
                jkForwarded = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Forwarded");
                jkClosed = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Closed") + jkResolved + jkRejected;
                jkPriority = grievanceMasterRepository.countByDistrictIdAndKeyFlag(distId, "Priority");
                jkNormal = grievanceMasterRepository.countByDistrictIdAndKeyFlag(distId, "Normal");
                jkUrgent = grievanceMasterRepository.countByDistrictIdAndKeyFlag(distId, "Urgent");
                jkInProgress = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "In Progress");
                jkDoesNotPertain = grievanceMasterRepository.countByDistrictIdAndStatus(distId, "Does Not Pertain");

                cpTotal = cpgramGrievanceMasterRepository.countByDistrict(distName);
                cpPending = cpgramGrievanceMasterRepository.countByDistrictAndStatus(distName, "Pending");
                cpResolved = cpgramGrievanceMasterRepository.countByDistrictAndStatus(distName, "Resolved") + cpgramGrievanceMasterRepository.countByDistrictAndStatus(distName, "Case Closed") + cpgramGrievanceMasterRepository.countByDistrictAndStatus(distName, "Closed");
                cpRejected = cpgramGrievanceMasterRepository.countByDistrictAndStatus(distName, "Rejected");
                cpClosed = cpResolved;

                PageRequest pageRequest = PageRequest.of(0, 2000, Sort.by("id").descending());
                jkGrievancesList = grievanceMasterRepository.findProjectionsByDistrictId(distId, pageRequest);
                cpGrievancesList = cpgramGrievanceMasterRepository.findByDistrict(distName);
                appealList = appealMasterRepository.findByDistrictId(distId);
                historyList = grievanceHistoryRepository.findTop10ByGrievanceDistrictIdOrderByCreatedAtDesc(distId);
            }

        } else if (role.equalsIgnoreCase("ROLE_DealingHand")) {
            // Assigned to DealingHand
            jkTotal = grievanceMasterRepository.countAssignedGrievances(user.getId());
            jkPending = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Registered") + grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Pending");
            jkResolved = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Resolved");
            jkRejected = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Rejected");
            jkForwarded = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Forwarded");
            jkClosed = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Closed") + jkResolved + jkRejected;
            jkPriority = grievanceMasterRepository.countAssignedGrievancesByKeyFlag(user.getId(), "Priority");
            jkNormal = grievanceMasterRepository.countAssignedGrievancesByKeyFlag(user.getId(), "Normal");
            jkUrgent = grievanceMasterRepository.countAssignedGrievancesByKeyFlag(user.getId(), "Urgent");
            jkInProgress = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "In Progress");
            jkDoesNotPertain = grievanceMasterRepository.countAssignedGrievancesByStatus(user.getId(), "Does Not Pertain");

            PageRequest pageRequest = PageRequest.of(0, 2000, Sort.by("id").descending());
            jkGrievancesList = grievanceMasterRepository.findAssignedProjectionsByUserId(user.getId(), pageRequest);
            historyList = grievanceHistoryRepository.findTop10ByOrderByCreatedAtDesc(); // global fallback

        } else if (role.equalsIgnoreCase("ROLE_Appellate")) {
            // Appellate scope
            appealList = appealMasterRepository.findByAppealedToId(user.getId());
            historyList = grievanceHistoryRepository.findTop10ByOrderByCreatedAtDesc();

        } else {
            // Citizen / Individual scope
            jkTotal = grievanceMasterRepository.countBySubmittedById(user.getId());
            jkPending = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Registered") + grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Pending");
            jkResolved = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Resolved");
            jkRejected = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Rejected");
            jkForwarded = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Forwarded");
            jkClosed = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Closed") + jkResolved + jkRejected;
            jkPriority = grievanceMasterRepository.countBySubmittedByIdAndKeyFlag(user.getId(), "Priority");
            jkNormal = grievanceMasterRepository.countBySubmittedByIdAndKeyFlag(user.getId(), "Normal");
            jkUrgent = grievanceMasterRepository.countBySubmittedByIdAndKeyFlag(user.getId(), "Urgent");
            jkInProgress = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "In Progress");
            jkDoesNotPertain = grievanceMasterRepository.countBySubmittedByIdAndStatus(user.getId(), "Does Not Pertain");

            PageRequest pageRequest = PageRequest.of(0, 2000, Sort.by("id").descending());
            jkGrievancesList = grievanceMasterRepository.findProjectionsBySubmittedById(user.getId(), pageRequest);
            appealList = appealMasterRepository.findBySubmittedById(user.getId());
            historyList = grievanceHistoryRepository.findTop10ByGrievanceSubmittedByIdOrderByCreatedAtDesc(user.getId());
        }

        // 6. Map to DTOs
        DashboardCountsDTO countsDTO = DashboardCountsDTO.builder()
                .total(jkTotal + cpTotal)
                .pending(jkPending + cpPending)
                .resolved(jkResolved + cpResolved)
                .rejected(jkRejected + cpRejected)
                .forwarded(jkForwarded)
                .closed(jkClosed + cpClosed)
                .priority(jkPriority)
                .normal(jkNormal)
                .urgent(jkUrgent)
                .inProgress(jkInProgress)
                .doesNotPertain(jkDoesNotPertain)
                .build();

        JKIGRAMSSummaryDTO jkigramsSummary = JKIGRAMSSummaryDTO.builder()
                .total(jkTotal)
                .pending(jkPending)
                .resolved(jkResolved)
                .rejected(jkRejected)
                .build();

        CPGRAMSSummaryDTO cpgramsSummary = CPGRAMSSummaryDTO.builder()
                .total(cpTotal)
                .pending(cpPending)
                .resolved(cpResolved)
                .rejected(cpRejected)
                .build();

        List<NotificationDTO> notificationDTOList = historyList.stream()
                .map(gh -> {
                    String status = gh.getStatus() != null ? gh.getStatus() : "Updated";
                    String type = "INFO";
                    if (status.equalsIgnoreCase("Resolved")) {
                        type = "SUCCESS";
                    } else if (status.equalsIgnoreCase("Rejected")) {
                        type = "WARNING";
                    }
                    String uniqId = gh.getGrievance() != null ? gh.getGrievance().getUniqId() : "Unknown";
                    return NotificationDTO.builder()
                            .id(gh.getId())
                            .message(String.format("Grievance %s status updated to %s (%s)", uniqId, status, gh.getActionTaken()))
                            .createdAt(gh.getCreatedAt() != null ? gh.getCreatedAt().toString() : "")
                            .type(type)
                            .read(false)
                            .build();
                })
                .collect(Collectors.toList());

        List<AppealSummaryDTO> appealSummaryDTOList = appealList.stream()
                .map(am -> AppealSummaryDTO.builder()
                        .id(am.getId())
                        .appealUniqId(am.getAppealUniqId())
                        .grievanceUniqId(am.getGrievance() != null ? am.getGrievance().getUniqId() : "NA")
                        .description(am.getDescription())
                        .status(am.getStatus())
                        .appealedTo(am.getAppealedTo() != null ? am.getAppealedTo().getName() : "NA")
                        .resolvedBy(am.getResolvedBy() != null ? am.getResolvedBy().getName() : "NA")
                        .submittedBy(am.getSubmittedBy() != null ? am.getSubmittedBy().getName() : "NA")
                        .createdAt(am.getCreatedAt() != null ? am.getCreatedAt().toString() : "")
                        .build())
                .collect(Collectors.toList());

        List<GrievanceSummaryDTO> grievancesTable = new ArrayList<>();

        // Add local grievances
        for (GrievanceProjection g : jkGrievancesList) {
            grievancesTable.add(GrievanceSummaryDTO.builder()
                    .id(g.getId())
                    .uniqId(g.getUniqId())
                    .description(g.getDescription())
                    .status(g.getStatus())
                    .finalStatus(g.getFinalStatus())
                    .origin(g.getOrigin())
                    .category(g.getCategoryName() != null ? g.getCategoryName() : "NA")
                    .department(g.getDeptName() != null ? g.getDeptName() : "NA")
                    .district(g.getDistrictName() != null ? g.getDistrictName() : "NA")
                    .submittedBy(g.getSubmitterFullName() != null ? g.getSubmitterFullName() : "NA")
                    .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                    .updatedAt(g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : "")
                    .keyFlag(g.getKeyFlag())
                    .build());
        }

        // Add CPGRAMS grievances
        for (CpgramGrievanceMaster c : cpGrievancesList) {
            grievancesTable.add(GrievanceSummaryDTO.builder()
                    .id(c.getId().longValue())
                    .uniqId(c.getRegistrationNo())
                    .description(c.getSubjectContent())
                    .status(c.getStatus())
                    .finalStatus(c.getFinalStatus())
                    .origin(c.getOrigin() != null ? c.getOrigin() : "CPGRAM")
                    .category("CPGRAMS Complaint")
                    .department(c.getForwardedDepartment() != null ? c.getForwardedDepartment() : "NA")
                    .district(c.getDistrict() != null ? c.getDistrict() : "NA")
                    .submittedBy("Citizen")
                    .createdAt(c.getCreatedDate() != null ? c.getCreatedDate().toString() : "")
                    .updatedAt(c.getCreatedDate() != null ? c.getCreatedDate().toString() : "")
                    .keyFlag("Normal")
                    .build());
        }

        return DashboardResponseDTO.builder()
                .userInformation(userInfoDTO)
                .dashboardCounts(countsDTO)
                .notifications(notificationDTOList)
                .appeals(appealSummaryDTOList)
                .jkigramsSummary(jkigramsSummary)
                .cpgramsSummary(cpgramsSummary)
                .grievances(grievancesTable)
                .build();
    }
}
