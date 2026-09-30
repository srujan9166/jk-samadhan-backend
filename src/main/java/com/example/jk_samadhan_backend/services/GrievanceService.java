package com.example.jk_samadhan_backend.services;

import java.security.Principal;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;
import com.example.jk_samadhan_backend.dto.GrievanceDTO;
import com.example.jk_samadhan_backend.dto.GrievanceResponseDTO;
import com.example.jk_samadhan_backend.dto.GrievanceProjection;
import com.example.jk_samadhan_backend.dto.PaginatedGrievancesResponseDTO;
import com.example.jk_samadhan_backend.dto.SuperAdminSummaryDTO;
import com.example.jk_samadhan_backend.dto.CreateUserReqDTO;
import com.example.jk_samadhan_backend.repositories.GrievanceSpecification;
import org.springframework.jdbc.core.JdbcTemplate;
import com.example.jk_samadhan_backend.models.UserType;
import com.example.jk_samadhan_backend.models.Designation;
import com.example.jk_samadhan_backend.models.UserExtraData;
import com.example.jk_samadhan_backend.repositories.UserTypeRepository;
import com.example.jk_samadhan_backend.repositories.DesignationRepository;
import com.example.jk_samadhan_backend.repositories.UserExtraDataRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.models.District;
import com.example.jk_samadhan_backend.models.Category;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;
import com.example.jk_samadhan_backend.repositories.DistrictRepository;
import com.example.jk_samadhan_backend.repositories.CategoryRepository;
import com.example.jk_samadhan_backend.repositories.SubCategoryLevel1Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel1;
import com.example.jk_samadhan_backend.models.Block;
import com.example.jk_samadhan_backend.models.Panchayat;
import com.example.jk_samadhan_backend.models.Municipality;
import com.example.jk_samadhan_backend.models.Ward;
import com.example.jk_samadhan_backend.repositories.BlockRepository;
import com.example.jk_samadhan_backend.repositories.PanchayatRepository;
import com.example.jk_samadhan_backend.repositories.MunicipalityRepository;
import com.example.jk_samadhan_backend.repositories.WardRepository;
import com.example.jk_samadhan_backend.models.Department;
import com.example.jk_samadhan_backend.repositories.DepartmentRepository;
import com.example.jk_samadhan_backend.repositories.AppealMasterRepository;
import com.example.jk_samadhan_backend.repositories.GrievanceHistoryRepository;
import com.example.jk_samadhan_backend.models.AppealMaster;
import com.example.jk_samadhan_backend.models.GrievanceHistory;

@Service
public class GrievanceService {

    private final UserRepository userRepository;
    private final GrievanceMasterRepository grievanceMasterRepository;
    private final DistrictRepository districtRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryLevel1Repository subCategoryLevel1Repository;
    private final BlockRepository blockRepository;
    private final PanchayatRepository panchayatRepository;
    private final MunicipalityRepository municipalityRepository;
    private final WardRepository wardRepository;
    private final DepartmentRepository departmentRepository;
    private final JdbcTemplate jdbcTemplate;
    private final UserTypeRepository userTypeRepository;
    private final DesignationRepository designationRepository;
    private final UserExtraDataRepository userExtraDataRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppealMasterRepository appealMasterRepository;
    private final GrievanceHistoryRepository grievanceHistoryRepository;
    private final com.example.jk_samadhan_backend.repositories.CpgramGrievanceMasterRepository cpgramGrievanceMasterRepository;
    private final com.example.jk_samadhan_backend.repositories.JkigramsDumpRepository jkigramsDumpRepository;
    private final com.example.jk_samadhan_backend.repositories.JkigramsMovementLogRepository jkigramsMovementLogRepository;
    private final com.example.jk_samadhan_backend.repositories.AssignedUsersRepository assignedUsersRepository;

    public GrievanceService(UserRepository userRepository,
            GrievanceMasterRepository grievanceMasterRepository,
            DistrictRepository districtRepository,
            CategoryRepository categoryRepository,
            SubCategoryLevel1Repository subCategoryLevel1Repository,
            BlockRepository blockRepository,
            PanchayatRepository panchayatRepository,
            MunicipalityRepository municipalityRepository,
            WardRepository wardRepository,
            DepartmentRepository departmentRepository,
            JdbcTemplate jdbcTemplate,
            UserTypeRepository userTypeRepository,
            DesignationRepository designationRepository,
            UserExtraDataRepository userExtraDataRepository,
            PasswordEncoder passwordEncoder,
            AppealMasterRepository appealMasterRepository,
            GrievanceHistoryRepository grievanceHistoryRepository,
            com.example.jk_samadhan_backend.repositories.CpgramGrievanceMasterRepository cpgramGrievanceMasterRepository,
            com.example.jk_samadhan_backend.repositories.JkigramsDumpRepository jkigramsDumpRepository,
            com.example.jk_samadhan_backend.repositories.JkigramsMovementLogRepository jkigramsMovementLogRepository,
            com.example.jk_samadhan_backend.repositories.AssignedUsersRepository assignedUsersRepository) {
        this.userRepository = userRepository;
        this.grievanceMasterRepository = grievanceMasterRepository;
        this.districtRepository = districtRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryLevel1Repository = subCategoryLevel1Repository;
        this.blockRepository = blockRepository;
        this.panchayatRepository = panchayatRepository;
        this.municipalityRepository = municipalityRepository;
        this.wardRepository = wardRepository;
        this.departmentRepository = departmentRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.userTypeRepository = userTypeRepository;
        this.designationRepository = designationRepository;
        this.userExtraDataRepository = userExtraDataRepository;
        this.passwordEncoder = passwordEncoder;
        this.appealMasterRepository = appealMasterRepository;
        this.grievanceHistoryRepository = grievanceHistoryRepository;
        this.cpgramGrievanceMasterRepository = cpgramGrievanceMasterRepository;
        this.jkigramsDumpRepository = jkigramsDumpRepository;
        this.jkigramsMovementLogRepository = jkigramsMovementLogRepository;
        this.assignedUsersRepository = assignedUsersRepository;
    }

    public GrievanceMaster lodgeGrievance(GrievanceDTO grievanceDTO, Principal principal) {

        Users user = userRepository.findByIdentifier(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GrievanceMaster grievanceMaster = new GrievanceMaster();
        grievanceMaster.setDescription(grievanceDTO.getDescription());
        grievanceMaster.setSubmittedBy(user);

        String generatedUniqId = "GRV" + java.time.Year.now().getValue() + "/"
                + (100000 + new java.util.Random().nextInt(900000));
        grievanceMaster.setUniqId(generatedUniqId);

        District district = null;
        if (grievanceDTO.getPertainDistrict() != null) {
            district = districtRepository.findByNameIgnoreCase(grievanceDTO.getPertainDistrict().trim())
                    .orElse(null);
        }
        if (district == null) {
            district = districtRepository.findById(1).orElse(null); // default fallback to district 1
        }
        grievanceMaster.setDistrict(district);

        if (district != null) {
            if ("Block".equalsIgnoreCase(grievanceDTO.getMunicipalityOrBlock())) {
                Block block = null;
                if (grievanceDTO.getBlockName() != null && !grievanceDTO.getBlockName().isBlank()) {
                    List<Block> blocks = blockRepository
                            .findAllByNameIgnoreCaseAndDistrictId(grievanceDTO.getBlockName().trim(), district.getId());
                    if (!blocks.isEmpty()) {
                        block = blocks.get(0);
                    }
                }
                grievanceMaster.setBlock(block);

                Panchayat panchayat = null;
                if (block != null && grievanceDTO.getPanchayatName() != null
                        && !grievanceDTO.getPanchayatName().isBlank()) {
                    List<Panchayat> panchayats = panchayatRepository
                            .findAllByNameIgnoreCaseAndBlockId(grievanceDTO.getPanchayatName().trim(), block.getId());
                    if (!panchayats.isEmpty()) {
                        panchayat = panchayats.get(0);
                    }
                }
                grievanceMaster.setPanchayat(panchayat);
            } else if ("Municipality".equalsIgnoreCase(grievanceDTO.getMunicipalityOrBlock())) {
                Municipality municipality = null;
                if (grievanceDTO.getMunicipalityName() != null && !grievanceDTO.getMunicipalityName().isBlank()) {
                    List<Municipality> municipalities = municipalityRepository.findAllByNameIgnoreCaseAndDistrictId(
                            grievanceDTO.getMunicipalityName().trim(), district.getId());
                    if (!municipalities.isEmpty()) {
                        municipality = municipalities.get(0);
                    }
                }
                grievanceMaster.setMunicipality(municipality);

                Ward ward = null;
                if (municipality != null && grievanceDTO.getWardName() != null
                        && !grievanceDTO.getWardName().isBlank()) {
                    List<Ward> wards = wardRepository.findAllByNameIgnoreCaseAndMunicipalityId(
                            grievanceDTO.getWardName().trim(), municipality.getId());
                    if (!wards.isEmpty()) {
                        ward = wards.get(0);
                    }
                }
                grievanceMaster.setWard(ward);
            }
        }

        Category category = null;
        if (grievanceDTO.getGrievanceCategory() != null) {
            String catName = grievanceDTO.getGrievanceCategory().trim();
            String deptVal = grievanceDTO.getDepartment();
            if (deptVal != null && !deptVal.isBlank()) {
                deptVal = deptVal.trim();
                Integer deptId = null;
                try {
                    deptId = Integer.parseInt(deptVal);
                } catch (NumberFormatException e) {
                    Department deptObj = departmentRepository.findByNameIgnoreCase(deptVal).orElse(null);
                    if (deptObj != null) {
                        deptId = deptObj.getId();
                    }
                }
                if (deptId != null) {
                    List<Category> categories = categoryRepository.findAllByNameIgnoreCaseAndDepartmentId(catName,
                            deptId);
                    if (!categories.isEmpty()) {
                        category = categories.get(0);
                    }
                }
            }
            if (category == null) {
                List<Category> categories = categoryRepository.findAllByNameIgnoreCase(catName);
                if (!categories.isEmpty()) {
                    category = categories.get(0);
                }
            }
        }
        grievanceMaster.setCategory(category);

        SubCategoryLevel1 subCategory = null;
        if (grievanceDTO.getSubCategory() != null && category != null) {
            List<SubCategoryLevel1> subCategories = subCategoryLevel1Repository
                    .findAllByNameIgnoreCaseAndCategoryId(grievanceDTO.getSubCategory().trim(), category.getId());
            if (!subCategories.isEmpty()) {
                subCategory = subCategories.get(0);
            }
        }
        grievanceMaster.setSubCatL1(subCategory);

        grievanceMaster.setOrigin("JKSAMADHAN");
        grievanceMaster.setStatus("Registered");
        grievanceMaster.setFinalStatus("Submitted");
        grievanceMaster.setKeyFlag("Normal");
        grievanceMaster.setPsga("NA");

        return grievanceMasterRepository.save(grievanceMaster);
    }

    @Transactional(readOnly = true)
    public List<GrievanceResponseDTO> getGrievancesForUser(Principal principal, String search) {
        String identifier = principal.getName();
        Users user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier));

        String role = "ROLE_Individual";
        if (user.getUserType() != null) {
            role = user.getUserType().getTypeName();
        } else if (user.getRole() != null) {
            role = user.getRole();
        }

        PageRequest pageRequest = PageRequest.of(0, 150000, Sort.by("id").descending());

        List<GrievanceProjection> projections;

        if (search != null && !search.trim().isEmpty()) {
            projections = grievanceMasterRepository.findProjectionsBySearch(search.trim(), pageRequest);
        } else if (role.equalsIgnoreCase("ROLE_SuperAdmin") || role.toUpperCase().contains("SUPERADMIN")) {
            projections = grievanceMasterRepository.findAllProjections(pageRequest);
        } else if (user.getDepartment() != null) {
            projections = grievanceMasterRepository.findProjectionsByDepartmentId(user.getDepartment().getId(),
                    pageRequest);
        } else if (role.equalsIgnoreCase("ROLE_DM") || role.toUpperCase().contains("DM")) {
            if (user.getDistrictEntity() != null) {
                projections = grievanceMasterRepository.findProjectionsByDistrictId(user.getDistrictEntity().getId(), pageRequest);
            } else if (user.getDistrict() != null && !user.getDistrict().isBlank() && !"Other".equalsIgnoreCase(user.getDistrict())) {
                District distObj = districtRepository.findByNameIgnoreCase(user.getDistrict().trim()).orElse(null);
                if (distObj != null) {
                    projections = grievanceMasterRepository.findProjectionsByDistrictId(distObj.getId(), pageRequest);
                } else {
                    projections = grievanceMasterRepository.findAllProjections(pageRequest);
                }
            } else {
                projections = grievanceMasterRepository.findAllProjections(pageRequest);
            }
        } else if (role.equalsIgnoreCase("ROLE_DealingHand") || role.toUpperCase().contains("DEALINGHAND")) {
            projections = grievanceMasterRepository.findAssignedProjectionsByUserId(user.getId(), pageRequest);
        } else {
            projections = grievanceMasterRepository.findProjectionsBySubmittedById(user.getId(), pageRequest);
        }

        return mapProjectionsToDTOs(projections);
    }

    private List<GrievanceResponseDTO> mapProjectionsToDTOs(List<GrievanceProjection> projections) {
        return projections.stream()
                .map(p -> GrievanceResponseDTO.builder()
                        .id(p.getId())
                        .uniqId(p.getUniqId())
                        .description(p.getDescription())
                        .latitude(p.getLatitude())
                        .longitude(p.getLongitude())
                        .origin(p.getOrigin())
                        .status(p.getStatus())
                        .finalStatus(p.getFinalStatus())
                        .keyFlag(p.getKeyFlag())
                        .psga(p.getPsga())
                        .fileName(p.getFileName())
                        .filePath(p.getFilePath())
                        .fileType(p.getFileType())
                        .secondFileName(p.getSecondFileName())
                        .secondFilePath(p.getSecondFilePath())
                        .secondFileType(p.getSecondFileType())
                        .ackSlipName(p.getAckSlipName())
                        .ackSlipPath(p.getAckSlipPath())
                        .cpgramRegNo(p.getCpgramRegNo())
                        .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
                        .updatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "")
                        .department(p.getDeptName() != null ? p.getDeptName() : "General Administration")
                        .grievanceCategory(
                                p.getCategoryName() != null ? p.getCategoryName() : "General Complaints & Petitions")
                        .subCategory(p.getSubCategoryName() != null ? p.getSubCategoryName() : "NA")
                        .windowType(p.getOrigin())
                        .citizenName(p.getSubmitterFullName() != null ? p.getSubmitterFullName() : "CITIZEN USER")
                        .citizenPhone(p.getSubmitterMobile() != null ? p.getSubmitterMobile() : "8377961497")
                        .submittedBy(p.getSubmitterId() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                                .id(p.getSubmitterId())
                                .name(p.getSubmitterFullName())
                                .mobile(p.getSubmitterMobile())
                                .email(p.getSubmitterEmail())
                                .gender(p.getSubmitterGender())
                                .build() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaginatedGrievancesResponseDTO getSuperAdminGrievances(
            String search, String status, String department, String district,
            String category, String dateFrom, String dateTo,
            String subCategory, String subCatL2, String subCatL3, String subCatL4,
            String origin, String finalStatus, String keyFlag, PageRequest pageRequest) {

        org.springframework.data.jpa.domain.Specification<GrievanceMaster> spec = GrievanceSpecification
                .getGrievancesSpec(
                        search, status, department, district, category, dateFrom, dateTo,
                        subCategory, subCatL2, subCatL3, subCatL4, origin, finalStatus, keyFlag);

        org.springframework.data.domain.Page<GrievanceMaster> pageResult = grievanceMasterRepository.findAll(spec,
                pageRequest);

        List<GrievanceResponseDTO> content = pageResult.getContent().stream()
                .map(g -> GrievanceResponseDTO.builder()
                        .id(g.getId())
                        .uniqId(g.getUniqId())
                        .description(g.getDescription())
                        .latitude(g.getLatitude())
                        .longitude(g.getLongitude())
                        .origin(g.getOrigin())
                        .status(g.getStatus())
                        .finalStatus(g.getFinalStatus())
                        .keyFlag(g.getKeyFlag())
                        .psga(g.getPsga())
                        .fileName(g.getFileName())
                        .filePath(g.getFilePath())
                        .fileType(g.getFileType())
                        .secondFileName(g.getSecondFileName())
                        .secondFilePath(g.getSecondFilePath())
                        .secondFileType(g.getSecondFileType())
                        .ackSlipName(g.getAckSlipName())
                        .ackSlipPath(g.getAckSlipPath())
                        .cpgramRegNo(g.getCpgramRegNo())
                        .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                        .updatedAt(g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : "")
                        .department(g.getCategory() != null && g.getCategory().getDepartment() != null
                                ? g.getCategory().getDepartment().getName()
                                : "General Administration")
                        .grievanceCategory(
                                g.getCategory() != null ? g.getCategory().getName() : "General Complaints & Petitions")
                        .subCategory(g.getSubCatL1() != null ? g.getSubCatL1().getName() : "NA")
                        .subCategoryL2(g.getSubCatL2() != null ? g.getSubCatL2().getName() : "NA")
                        .subCategoryL3(g.getSubCatL3() != null ? g.getSubCatL3().getName() : "NA")
                        .subCategoryL4(g.getSubCatL4() != null ? g.getSubCatL4().getName() : "NA")
                        .district(g.getDistrict() != null ? g.getDistrict().getName() : "NA")
                        .division(g.getDistrict() != null && g.getDistrict().getDivision() != null
                                ? g.getDistrict().getDivision().getName()
                                : "NA")
                        .windowType(g.getOrigin())
                        .citizenName(g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "CITIZEN USER")
                        .citizenPhone(g.getSubmittedBy() != null ? g.getSubmittedBy().getMobile() : "8377961497")
                        .submittedBy(g.getSubmittedBy() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                                .id(g.getSubmittedBy().getId())
                                .name(g.getSubmittedBy().getName())
                                .mobile(g.getSubmittedBy().getMobile())
                                .email(g.getSubmittedBy().getEmail())
                                .gender(g.getSubmittedBy().getGender())
                                .build() : null)
                        .build())
                .collect(Collectors.toList());

        return PaginatedGrievancesResponseDTO.builder()
                .content(content)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .currentPage(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .build();
    }

    @Transactional(readOnly = true)
    public SuperAdminSummaryDTO getSuperAdminAnalyticsSummary(
            String search, String status, String department, String district,
            String category, String dateFrom, String dateTo,
            String subCategory, String subCatL2, String subCatL3, String subCatL4,
            String origin, String finalStatus, String keyFlag) {

        org.springframework.data.jpa.domain.Specification<GrievanceMaster> baseSpec = GrievanceSpecification
                .getGrievancesSpec(
                        search, null, department, district, category, dateFrom, dateTo,
                        subCategory, subCatL2, subCatL3, subCatL4, origin, finalStatus, keyFlag);

        long totalGrievances = grievanceMasterRepository.count(baseSpec);

        long open = grievanceMasterRepository.count(org.springframework.data.jpa.domain.Specification.where(baseSpec)
                .and((root, query, cb) -> cb.equal(root.get("status"), "Open")));
        long pending = grievanceMasterRepository.count(org.springframework.data.jpa.domain.Specification.where(baseSpec)
                .and((root, query, cb) -> cb.or(
                        cb.equal(root.get("status"), "Registered"),
                        cb.equal(root.get("status"), "Pending"))));
        long resolved = grievanceMasterRepository
                .count(org.springframework.data.jpa.domain.Specification.where(baseSpec)
                        .and((root, query, cb) -> cb.or(
                                cb.equal(root.get("status"), "Resolved"),
                                cb.equal(root.get("status"), "Closed"))));
        long rejected = grievanceMasterRepository
                .count(org.springframework.data.jpa.domain.Specification.where(baseSpec)
                        .and((root, query, cb) -> cb.equal(root.get("status"), "Rejected")));

        long openTotal = pending + open;
        long closedTotal = resolved + rejected;

        double disposalPercentage = totalGrievances == 0 ? 0.0 : ((double) closedTotal * 100.0) / totalGrievances;
        disposalPercentage = Math.round(disposalPercentage * 100.0) / 100.0;

        long appealedCount = grievanceMasterRepository
                .count(org.springframework.data.jpa.domain.Specification.where(baseSpec)
                        .and((root, query, cb) -> cb.equal(root.get("status"), "Appealed")));

        // Query monthly citizen registration counts
        StringBuilder citizenSql = new StringBuilder(
                "SELECT TO_CHAR(u.created_at, 'Mon-YY') as label, COUNT(*) as value " +
                        "FROM jks_3nf.users u " +
                        "LEFT JOIN jks_3nf.districts d ON u.district_id = d.id " +
                        "WHERE u.user_type_id = 10 AND u.created_at IS NOT NULL ");
        List<Object> citizenParams = new ArrayList<>();

        if (district != null && !district.trim().isEmpty()) {
            citizenSql.append("AND (d.name ILIKE ? OR u.district ILIKE ?) ");
            citizenParams.add("%" + district.trim() + "%");
            citizenParams.add("%" + district.trim() + "%");
        }

        if (dateFrom != null && !dateFrom.trim().isEmpty()) {
            citizenSql.append("AND u.created_at >= CAST(? AS timestamp with time zone) ");
            citizenParams.add(dateFrom.trim() + " 00:00:00+00");
        }

        if (dateTo != null && !dateTo.trim().isEmpty()) {
            citizenSql.append("AND u.created_at <= CAST(? AS timestamp with time zone) ");
            citizenParams.add(dateTo.trim() + " 23:59:59+00");
        }

        citizenSql.append(
                "GROUP BY TO_CHAR(u.created_at, 'Mon-YY'), EXTRACT(YEAR FROM u.created_at), EXTRACT(MONTH FROM u.created_at) "
                        +
                        "ORDER BY EXTRACT(YEAR FROM u.created_at) ASC, EXTRACT(MONTH FROM u.created_at) ASC");

        List<SuperAdminSummaryDTO.MapEntryDTO> monthlyCitizenTrends = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(citizenSql.toString(), citizenParams.toArray());
            for (Map<String, Object> row : rows) {
                monthlyCitizenTrends.add(new SuperAdminSummaryDTO.MapEntryDTO(
                        (String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
            // Ignore/Log
        }

        return SuperAdminSummaryDTO.builder()
                .totalGrievances(totalGrievances)
                .open(openTotal)
                .pending(pending)
                .resolved(resolved)
                .rejected(rejected)
                .averageResolutionTimeDays(disposalPercentage)
                .web(0)
                .app(0)
                .appealReceivedCount(appealedCount)
                .monthlyCitizenTrends(monthlyCitizenTrends)
                .build();
    }

    @Transactional(readOnly = true)
    public SuperAdminSummaryDTO getSuperAdminDashboardSummary() {
        long totalGrievances = 0;
        long open = 0;
        long pending = 0;
        long resolved = 0;
        long rejected = 0;
        long escalated = 0;
        double averageResolutionTime = 0.0;

        long web = 0;
        long app = 0;
        long appealReceivedCount = 0;
        long forwarded = 0;
        long dnpCount = 0;
        long cpgramClosed = 0;
        long fwdToCPGRAM = 0;
        long totalCPGRAM = 0;

        Map<String, Long> statusDistribution = new HashMap<>();

        try {
            List<Map<String, Object>> statusCounts = jdbcTemplate.queryForList(
                    "SELECT status, COUNT(*) as count FROM jks_3nf.grievance_master GROUP BY status");
            for (Map<String, Object> row : statusCounts) {
                String status = (String) row.get("status");
                long count = ((Number) row.get("count")).longValue();
                if (status != null) {
                    statusDistribution.put(status, count);
                    totalGrievances += count;
                    if ("Registered".equalsIgnoreCase(status) || "Pending".equalsIgnoreCase(status)) {
                        pending += count;
                    } else if ("Open".equalsIgnoreCase(status)) {
                        open += count;
                    } else if ("Resolved".equalsIgnoreCase(status) || "Closed".equalsIgnoreCase(status)) {
                        resolved += count;
                    } else if ("Rejected".equalsIgnoreCase(status)) {
                        rejected += count;
                    }
                }
            }
        } catch (Exception e) {
        }

        try {
            escalated = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE key_flag = 'Priority' OR key_flag = 'Urgent'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            Double avgTime = jdbcTemplate.queryForObject(
                    "SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) FROM jks_3nf.grievance_master WHERE status IN ('Resolved', 'Closed') AND updated_at IS NOT NULL",
                    Double.class);
            if (avgTime != null) {
                averageResolutionTime = avgTime;
            }
        } catch (Exception e) {
        }

        try {
            web = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE origin = 'JKSAMADHAN'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            app = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE origin != 'JKSAMADHAN'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            forwarded = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE status = 'Forwarded' AND (final_status IS NULL OR final_status = '' OR final_status = 'NA')",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            cpgramClosed = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE status = 'Closed'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            fwdToCPGRAM = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE status = 'Forwarded To CPGRAM'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            totalCPGRAM = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE status = 'Forwarded To CPGRAM' OR status = 'Closed'",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            appealReceivedCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.appeal_master am JOIN jks_3nf.appeal_assign_user au ON am.id = au.appeal_id WHERE au.action = 'Pending' AND au.enabled = true",
                    Long.class);
        } catch (Exception e) {
        }

        try {
            dnpCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM jks_3nf.grievance_master WHERE status ILIKE ANY (ARRAY['dnpToOffice', 'Does not pertain to this office'])",
                    Long.class);
        } catch (Exception e) {
        }

        List<SuperAdminSummaryDTO.MapEntryDTO> deptCounts = new ArrayList<>();
        try {
            List<Map<String, Object>> deptRows = jdbcTemplate.queryForList(
                    "SELECT COALESCE(d.name, 'General Administration') as label, COUNT(gm.id) as value " +
                            "FROM jks_3nf.grievance_master gm " +
                            "LEFT JOIN jks_3nf.category c ON gm.category_id = c.id " +
                            "LEFT JOIN jks_3nf.departments d ON c.department_id = d.id " +
                            "GROUP BY d.name " +
                            "ORDER BY value DESC LIMIT 10");
            for (Map<String, Object> row : deptRows) {
                deptCounts.add(new SuperAdminSummaryDTO.MapEntryDTO((String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
        }

        List<SuperAdminSummaryDTO.MapEntryDTO> distCounts = new ArrayList<>();
        try {
            List<Map<String, Object>> distRows = jdbcTemplate.queryForList(
                    "SELECT COALESCE(dist.name, 'NA') as label, COUNT(gm.id) as value " +
                            "FROM jks_3nf.grievance_master gm " +
                            "LEFT JOIN jks_3nf.district dist ON gm.district_id = dist.id " +
                            "GROUP BY dist.name " +
                            "ORDER BY value DESC LIMIT 10");
            for (Map<String, Object> row : distRows) {
                distCounts.add(new SuperAdminSummaryDTO.MapEntryDTO((String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
        }

        List<SuperAdminSummaryDTO.MapEntryDTO> monthlyTrends = new ArrayList<>();
        try {
            List<Map<String, Object>> monthRows = jdbcTemplate.queryForList(
                    "SELECT to_char(created_at, 'YYYY-MM') as label, COUNT(*) as value " +
                            "FROM jks_3nf.grievance_master " +
                            "WHERE created_at >= NOW() - INTERVAL '6 months' " +
                            "GROUP BY label " +
                            "ORDER BY label ASC");
            for (Map<String, Object> row : monthRows) {
                monthlyTrends.add(new SuperAdminSummaryDTO.MapEntryDTO((String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
        }

        List<SuperAdminSummaryDTO.MapEntryDTO> workloads = new ArrayList<>();
        try {
            List<Map<String, Object>> workloadRows = jdbcTemplate.queryForList(
                    "SELECT COALESCE(u.username, 'Unassigned') as label, COUNT(au.id) as value " +
                            "FROM jks_3nf.assigned_users au " +
                            "JOIN jks_3nf.users u ON au.assigned_to_user_id = u.id " +
                            "WHERE au.enabled = true " +
                            "GROUP BY u.username " +
                            "ORDER BY value DESC LIMIT 10");
            for (Map<String, Object> row : workloadRows) {
                workloads.add(new SuperAdminSummaryDTO.MapEntryDTO((String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
        }

        List<SuperAdminSummaryDTO.MapEntryDTO> monthlyCitizenTrends = new ArrayList<>();
        try {
            List<Map<String, Object>> citizenRows = jdbcTemplate.queryForList(
                    "SELECT TO_CHAR(created_at, 'Mon-YY') as label, COUNT(*) as value " +
                            "FROM jks_3nf.users " +
                            "WHERE user_type_id = 10 AND created_at IS NOT NULL " +
                            "GROUP BY TO_CHAR(created_at, 'Mon-YY'), EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at) "
                            +
                            "ORDER BY EXTRACT(YEAR FROM created_at) ASC, EXTRACT(MONTH FROM created_at) ASC");
            for (Map<String, Object> row : citizenRows) {
                monthlyCitizenTrends.add(new SuperAdminSummaryDTO.MapEntryDTO(
                        (String) row.get("label"),
                        ((Number) row.get("value")).longValue()));
            }
        } catch (Exception e) {
        }

        return SuperAdminSummaryDTO.builder()
                .totalGrievances(totalGrievances)
                .open(open)
                .pending(pending)
                .resolved(resolved)
                .rejected(rejected)
                .escalated(escalated)
                .averageResolutionTimeDays(Math.round(averageResolutionTime * 10.0) / 10.0)
                .web(web)
                .app(app)
                .appealReceivedCount(appealReceivedCount)
                .forwarded(forwarded)
                .dnpCount(dnpCount)
                .cpgramClosed(cpgramClosed)
                .fwdToCPGRAM(fwdToCPGRAM)
                .totalCPGRAM(totalCPGRAM)
                .statusDistribution(statusDistribution)
                .departmentWiseCounts(deptCounts)
                .districtWiseCounts(distCounts)
                .monthlyTrends(monthlyTrends)
                .monthlyCitizenTrends(monthlyCitizenTrends)
                .officerWorkloads(workloads)
                .build();
    }

    @Transactional
    public void createOfficialUser(CreateUserReqDTO req) {
        if (userRepository.existsByUsername(req.getEmail())) {
            throw new RuntimeException("Username/Email already exists: " + req.getEmail());
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists: " + req.getEmail());
        }
        if (userRepository.existsByMobile(req.getMobile())) {
            throw new RuntimeException("Mobile number already exists: " + req.getMobile());
        }

        Users user = new Users();
        user.setUuid(java.util.UUID.randomUUID());
        user.setUsername(req.getEmail());
        user.setEmail(req.getEmail());
        user.setFirstName(req.getFirstName());
        user.setMiddleName(req.getMiddleName());
        user.setLastName(req.getLastName());
        user.setMobile(req.getMobile());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEnabled(true);

        // Map userType role
        if ("Dealing Hand Head".equalsIgnoreCase(req.getUserType()) || "DealingHand".equalsIgnoreCase(req.getUserType())) {
            user.setRole("DealingHand");
        } else if ("DM".equalsIgnoreCase(req.getUserType()) || "District Magistrate".equalsIgnoreCase(req.getUserType()) || "ROLE_DM".equalsIgnoreCase(req.getUserType())) {
            user.setRole("DM");
        } else if ("Monitoring Cell".equalsIgnoreCase(req.getUserType()) || "ROLE_MONITORING_CELL".equalsIgnoreCase(req.getUserType())) {
            user.setRole("MONITORING_CELL");
        } else if ("Raabita Head".equalsIgnoreCase(req.getUserType()) || "RMC Head".equalsIgnoreCase(req.getUserType()) || "ROLE_RAABITA_HEAD".equalsIgnoreCase(req.getUserType()) || "ROLE_RMC_HEAD".equalsIgnoreCase(req.getUserType())) {
            user.setRole("ROLE_RAABITA_HEAD");
        } else {
            user.setRole("ADMIN");
        }

        // Set UserType entity
        String typeName = "ROLE_Admin";
        if ("Dealing Hand Head".equalsIgnoreCase(req.getUserType()) || "DealingHand".equalsIgnoreCase(req.getUserType())) {
            typeName = "ROLE_DealingHand";
        } else if ("DM".equalsIgnoreCase(req.getUserType()) || "District Magistrate".equalsIgnoreCase(req.getUserType()) || "ROLE_DM".equalsIgnoreCase(req.getUserType())) {
            typeName = "ROLE_DM";
        } else if ("Monitoring Cell".equalsIgnoreCase(req.getUserType()) || "ROLE_MONITORING_CELL".equalsIgnoreCase(req.getUserType())) {
            typeName = "ROLE_MONITORING_CELL";
        } else if ("Raabita Head".equalsIgnoreCase(req.getUserType()) || "RMC Head".equalsIgnoreCase(req.getUserType()) || "ROLE_RAABITA_HEAD".equalsIgnoreCase(req.getUserType()) || "ROLE_RMC_HEAD".equalsIgnoreCase(req.getUserType())) {
            typeName = "ROLE_RAABITA_HEAD";
        }

        final String finalTypeName = typeName;
        UserType ut = userTypeRepository.findByTypeName(finalTypeName)
                .or(() -> userTypeRepository.findByTypeName("ROLE_DM"))
                .or(() -> userTypeRepository.findByTypeName("ROLE_Admin"))
                .or(() -> userTypeRepository.findAll().stream().findFirst())
                .orElseGet(() -> {
                    UserType newUt = UserType.builder().typeName(finalTypeName).build();
                    return userTypeRepository.save(newUt);
                });
        user.setUserType(ut);

        // Set Office Name
        if (req.getOfficeName() != null && !req.getOfficeName().trim().isEmpty()) {
            user.setOfficeName(req.getOfficeName().trim());
        }

        // Set District
        if (req.getDistrict() != null && !req.getDistrict().trim().isEmpty()) {
            user.setDistrict(req.getDistrict().trim());
            districtRepository.findByNameIgnoreCase(req.getDistrict().trim())
                    .ifPresent(user::setDistrictEntity);
        }

        // Set Designation
        if (req.getDesignationName() != null && !req.getDesignationName().trim().isEmpty()) {
            Designation desig = designationRepository.findByNameIgnoreCase(req.getDesignationName().trim())
                    .orElseGet(() -> {
                        Designation d = Designation.builder()
                                .name(req.getDesignationName().trim().toUpperCase())
                                .build();
                        return designationRepository.save(d);
                    });
            user.setDesignation(desig);
        }

        Users savedUser = userRepository.save(user);

        // Store user type selection in UserExtraData
        UserExtraData extra = UserExtraData.builder()
                .user(savedUser)
                .dataKey("user_classification")
                .dataValue(req.getUserType() != null ? req.getUserType().toUpperCase() : "OFFICIAL USER")
                .build();
        userExtraDataRepository.save(extra);

        if (req.getDivision() != null && !req.getDivision().trim().isEmpty()) {
            UserExtraData divExtra = UserExtraData.builder()
                    .user(savedUser)
                    .dataKey("division")
                    .dataValue(req.getDivision().trim().toUpperCase())
                    .build();
            userExtraDataRepository.save(divExtra);
        }
    }

    @Transactional(readOnly = true)
    public com.example.jk_samadhan_backend.dto.PaginatedDealingHandReportDTO getDealingHandReport(int page, int size, String search) {
        String cleanSearch = search != null ? search.trim() : "";
        int pageSize = size > 0 ? size : 10;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), pageSize);
        
        List<Object[]> rawList = userRepository.fetchDealingHandReportRaw(cleanSearch, pageable);
        long totalElements = userRepository.countDealingHandReportRaw(cleanSearch);
        
        List<com.example.jk_samadhan_backend.dto.DealingHandReportDTO> reportItems = new ArrayList<>();
        if (rawList != null) {
            for (Object[] row : rawList) {
                Long userId = row[0] != null ? ((Number) row[0]).longValue() : 0L;
                String fullName = row[1] != null && !row[1].toString().isBlank() ? row[1].toString() : (row[2] != null ? row[2].toString() : "Dealing Hand");
                String username = row[2] != null ? row[2].toString() : "";
                String email = row[3] != null ? row[3].toString() : username;
                String desig = row[4] != null ? row[4].toString() : "Dealing Hand User";
                String mobile = row[5] != null ? row[5].toString() : "N/A";
                long totalCount = row[6] != null ? ((Number) row[6]).longValue() : 0L;

                reportItems.add(com.example.jk_samadhan_backend.dto.DealingHandReportDTO.builder()
                        .userId(userId)
                        .fullName(fullName)
                        .username(username)
                        .email(email)
                        .designation(desig)
                        .mobile(mobile)
                        .totalGrievances(totalCount)
                        .build());
            }
        }

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return com.example.jk_samadhan_backend.dto.PaginatedDealingHandReportDTO.builder()
                .content(reportItems)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(page + 1)
                .pageSize(pageSize)
                .build();
    }

    @Transactional(readOnly = true)
    public PaginatedGrievancesResponseDTO getDealingHandGrievancesModal(String identifier, int page, int size, String search) {
        Users u = userRepository.findByIdentifier(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> userRepository.findByUsername(identifier))
                .orElse(null);

        if (u == null) {
            try {
                Long id = Long.parseLong(identifier);
                u = userRepository.findById(id).orElse(null);
            } catch (Exception e) {}
        }

        if (u == null) {
            return PaginatedGrievancesResponseDTO.builder()
                    .content(List.of())
                    .totalElements(0)
                    .totalPages(0)
                    .currentPage(page + 1)
                    .pageSize(size)
                    .build();
        }

        List<GrievanceMaster> submitted = grievanceMasterRepository.findBySubmittedById(u.getId());
        List<GrievanceMaster> assigned = grievanceMasterRepository.findAssignedGrievances(u.getId());

        Map<Long, GrievanceMaster> map = new HashMap<>();
        if (submitted != null) {
            for (GrievanceMaster g : submitted) map.put(g.getId(), g);
        }
        if (assigned != null) {
            for (GrievanceMaster g : assigned) map.put(g.getId(), g);
        }

        List<GrievanceMaster> allGrievances = new ArrayList<>(map.values());

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            allGrievances = allGrievances.stream()
                    .filter(g -> {
                        String uniq = (g.getUniqId() != null ? g.getUniqId() : "").toLowerCase();
                        String dept = (g.getCategory() != null && g.getCategory().getDepartment() != null ? g.getCategory().getDepartment().getName() : "").toLowerCase();
                        String cat = (g.getCategory() != null ? g.getCategory().getName() : "").toLowerCase();
                        String submitter = (g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "").toLowerCase();
                        String status = (g.getStatus() != null ? g.getStatus() : "").toLowerCase();
                        return uniq.contains(q) || dept.contains(q) || cat.contains(q) || submitter.contains(q) || status.contains(q);
                    })
                    .collect(Collectors.toList());
        }

        allGrievances.sort(java.util.Comparator.comparing(GrievanceMaster::getCreatedAt, java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder())));

        int totalElements = allGrievances.size();
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 1;
        int start = Math.min(page * size, totalElements);
        int end = Math.min(start + size, totalElements);
        List<GrievanceMaster> pagedList = (start <= end && start < totalElements) ? allGrievances.subList(start, end) : List.of();

        List<GrievanceResponseDTO> dtos = pagedList.stream().map(g -> GrievanceResponseDTO.builder()
                .id(g.getId())
                .uniqId(g.getUniqId() != null ? g.getUniqId() : "GRV2026/" + g.getId())
                .description(g.getDescription())
                .status(g.getStatus() != null ? g.getStatus() : "Pending")
                .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                .department(g.getCategory() != null && g.getCategory().getDepartment() != null ? g.getCategory().getDepartment().getName() : "General Administration")
                .grievanceCategory(g.getCategory() != null ? g.getCategory().getName() : "General Complaints & Petitions")
                .submittedBy(g.getSubmittedBy() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                        .name(g.getSubmittedBy().getName())
                        .email(g.getSubmittedBy().getEmail())
                        .mobile(g.getSubmittedBy().getMobile())
                        .build() : null)
                .citizenName(g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "Citizen User")
                .build()
        ).collect(Collectors.toList());

        return PaginatedGrievancesResponseDTO.builder()
                .content(dtos)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(page + 1)
                .pageSize(size)
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCitizenListReport(
            int start, int length, String search, String district,
            String dateFrom, String dateTo, String gender,
            String orderColumn, String orderDirection,
            Integer blockId, Integer panchayatId, Integer municipalityId, Integer wardId) {

        Map<String, Object> result = new HashMap<>();

        // 1. Total Count
        long totalRecords = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM jks_3nf.users WHERE user_type_id = 10", Long.class);

        // 2. Build Filter query
        StringBuilder filterSql = new StringBuilder("FROM jks_3nf.users u " +
                "LEFT JOIN jks_3nf.states s ON s.id = u.state_id " +
                "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
                "LEFT JOIN jks_3nf.blocks blk ON blk.id = u.block_id " +
                "LEFT JOIN jks_3nf.panchayats panch ON panch.id = u.panchayat_id " +
                "LEFT JOIN jks_3nf.municipalities mun ON mun.id = u.municipality_id " +
                "LEFT JOIN jks_3nf.wards ward ON ward.id = u.ward_id " +
                "LEFT JOIN ( " +
                "    SELECT submitted_by_user_id, COUNT(id) AS grievanceFiled " +
                "    FROM jks_3nf.grievance_master " +
                "    GROUP BY submitted_by_user_id " +
                ") g ON g.submitted_by_user_id = u.id " +
                "WHERE u.user_type_id = 10 ");

        List<Object> queryParams = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String likePattern = "%" + search.trim() + "%";
            filterSql.append(
                    "AND (u.first_name ILIKE ? OR u.middle_name ILIKE ? OR u.last_name ILIKE ? OR u.mobile ILIKE ? OR dist.name ILIKE ? OR blk.name ILIKE ? OR panch.name ILIKE ?) ");
            for (int i = 0; i < 7; i++) {
                queryParams.add(likePattern);
            }
        }

        if (district != null && !district.trim().isEmpty() && !"0".equals(district)) {
            filterSql.append("AND dist.name ILIKE ? ");
            queryParams.add(district.trim());
        }

        if (gender != null && !gender.trim().isEmpty() && !"0".equals(gender)) {
            if ("Male".equalsIgnoreCase(gender) || "Female".equalsIgnoreCase(gender)
                    || "Transgender".equalsIgnoreCase(gender)) {
                filterSql.append("AND u.gender ILIKE ? ");
                queryParams.add(gender.trim());
            }
        }

        if (dateFrom != null && !dateFrom.trim().isEmpty()) {
            filterSql.append("AND u.created_at >= CAST(? AS timestamp with time zone) ");
            queryParams.add(dateFrom.trim() + " 00:00:00+00");
        }

        if (dateTo != null && !dateTo.trim().isEmpty()) {
            filterSql.append("AND u.created_at <= CAST(? AS timestamp with time zone) ");
            queryParams.add(dateTo.trim() + " 23:59:59+00");
        }

        if (blockId != null && blockId > 0) {
            filterSql.append("AND u.block_id = ? ");
            queryParams.add(blockId);
        }

        if (panchayatId != null && panchayatId > 0) {
            filterSql.append("AND u.panchayat_id = ? ");
            queryParams.add(panchayatId);
        }

        if (municipalityId != null && municipalityId > 0) {
            filterSql.append("AND u.municipality_id = ? ");
            queryParams.add(municipalityId);
        }

        if (wardId != null && wardId > 0) {
            filterSql.append("AND u.ward_id = ? ");
            queryParams.add(wardId);
        }

        // 3. Count Filtered
        String countSql = "SELECT COUNT(*) " + filterSql.toString();
        long filteredRecords = jdbcTemplate.queryForObject(countSql, Long.class, queryParams.toArray());

        // 4. Sort and Paginate
        String sqlOrderCol = "u.created_at";
        if ("name".equalsIgnoreCase(orderColumn)) {
            sqlOrderCol = "TRIM(CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name))";
        } else if ("district".equalsIgnoreCase(orderColumn)) {
            sqlOrderCol = "dist.name";
        } else if ("gender".equalsIgnoreCase(orderColumn)) {
            sqlOrderCol = "u.gender";
        } else if ("mobile".equalsIgnoreCase(orderColumn)) {
            sqlOrderCol = "u.mobile";
        } else if ("grievanceFiled".equalsIgnoreCase(orderColumn) || "grievancesFiled".equalsIgnoreCase(orderColumn)) {
            sqlOrderCol = "grievanceFiled";
        }

        String direction = "DESC";
        if ("ASC".equalsIgnoreCase(orderDirection)) {
            direction = "ASC";
        }

        String selectFields = "SELECT " +
                "    COALESCE(g.grievanceFiled, 0) AS grievanceFiled, " +
                "    u.username, " +
                "    TRIM(CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name)) AS name, " +
                "    COALESCE(s.name, 'JAMMU AND KASHMIR') AS region, " +
                "    COALESCE(dist.name, 'NA') AS district, " +
                "    u.created_at AS created_date, " +
                "    COALESCE(u.gender, 'NA') AS gender, " +
                "    u.mobile, " +
                "    'websiteUser' AS mode, " +
                "    COALESCE(mun.name, 'NA') AS municipality, " +
                "    COALESCE(ward.name, 'NA') AS ward, " +
                "    COALESCE(blk.name, 'NA') AS block, " +
                "    COALESCE(panch.name, 'NA') AS panchayat ";

        String fetchSql = selectFields + filterSql.toString() + " ORDER BY " + sqlOrderCol + " " + direction
                + " LIMIT ? OFFSET ?";
        queryParams.add(length);
        queryParams.add(start);

        List<Map<String, Object>> data = jdbcTemplate.queryForList(fetchSql, queryParams.toArray());

        result.put("recordsTotal", totalRecords);
        result.put("recordsFiltered", filteredRecords);
        result.put("data", data);

        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCitizenDivisionReport() {
        Map<String, Object> result = new HashMap<>();
        String sql = "SELECT " +
                "    SUM(CASE WHEN UPPER(div.name) = 'JAMMU' THEN 1 ELSE 0 END) AS jammuDivision, " +
                "    SUM(CASE WHEN UPPER(div.name) = 'KASHMIR' THEN 1 ELSE 0 END) AS kashmirDivision, " +
                "    COUNT(*) AS totalRegistration " +
                "FROM jks_3nf.users u " +
                "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
                "LEFT JOIN jks_3nf.divisions div ON div.id = dist.division_id " +
                "WHERE u.user_type_id = 10";

        List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
        result.put("draw", 1);
        result.put("recordsTotal", 1);
        result.put("recordsFiltered", 1);
        result.put("data", data);
        result.put("statusCode", "1");
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCitizenDistrictReport(
            int start, int length, String search, String state, String district) {
        Map<String, Object> result = new HashMap<>();

        // Base filter query
        StringBuilder filterSql = new StringBuilder(
                "FROM jks_3nf.users u " +
                        "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
                        "LEFT JOIN jks_3nf.states s ON s.id = u.state_id " +
                        "WHERE u.user_type_id = 10 AND u.district_id IS NOT NULL ");

        List<Object> queryParams = new ArrayList<>();

        if (state != null && !"0".equals(state) && !state.trim().isEmpty()) {
            filterSql.append("AND s.name ILIKE ? ");
            queryParams.add(state.trim());
        }

        if (district != null && !"0".equals(district) && !district.trim().isEmpty()) {
            filterSql.append("AND dist.name ILIKE ? ");
            queryParams.add(district.trim());
        }

        if (search != null && !search.trim().isEmpty()) {
            String likePattern = "%" + search.trim() + "%";
            filterSql.append("AND (dist.name ILIKE ? OR s.name ILIKE ?) ");
            queryParams.add(likePattern);
            queryParams.add(likePattern);
        }

        // Count query
        String countSql = "SELECT COUNT(DISTINCT dist.id) " + filterSql.toString();
        long totalRecords = jdbcTemplate.queryForObject(countSql, Long.class, queryParams.toArray());

        // Fetch query with pagination
        String fetchSql = "SELECT " +
                "    COALESCE(UPPER(dist.name), 'NA') AS district, " +
                "    COALESCE(UPPER(s.name), 'JAMMU AND KASHMIR') AS region, " +
                "    COUNT(*) AS totalRegistration " +
                filterSql.toString() +
                "GROUP BY UPPER(dist.name), UPPER(s.name) " +
                "ORDER BY totalRegistration DESC " +
                "LIMIT ? OFFSET ?";

        queryParams.add(length);
        queryParams.add(start);

        List<Map<String, Object>> data = jdbcTemplate.queryForList(fetchSql, queryParams.toArray());

        result.put("draw", 1);
        result.put("recordsTotal", totalRecords);
        result.put("recordsFiltered", totalRecords);
        result.put("data", data);
        result.put("statusCode", "1");
        return result;
    }

    @Transactional(readOnly = true)
    public GrievanceResponseDTO getGrievanceDetails(String idOrUniqId, Principal principal) {
        String identifier = principal.getName();
        Users currentUser = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier));

        GrievanceMaster g = null;
        try {
            Long id = Long.parseLong(idOrUniqId);
            g = grievanceMasterRepository.findById(id).orElse(null);
            if (g == null) {
                g = grievanceMasterRepository.findByUniqId(idOrUniqId).orElse(null);
            }
        } catch (NumberFormatException e) {
            g = grievanceMasterRepository.findByUniqId(idOrUniqId).orElse(null);
        }

        // If not found in grievance_master, check CPGRAMS & JKIGRAMS
        if (g == null) {
            com.example.jk_samadhan_backend.models.CpgramGrievanceMaster cpgram = cpgramGrievanceMasterRepository
                    .findByRegistrationNo(idOrUniqId).orElse(null);
            if (cpgram == null) {
                try {
                    Integer cid = Integer.parseInt(idOrUniqId);
                    cpgram = cpgramGrievanceMasterRepository.findById(cid).orElse(null);
                } catch (Exception ignored) {
                }
            }
            if (cpgram != null) {
                return mapCpgramToDetailDTO(cpgram);
            }

            com.example.jk_samadhan_backend.models.JkigramsDump jkd = jkigramsDumpRepository
                    .findByReferenceId(idOrUniqId).orElse(null);
            if (jkd == null) {
                try {
                    Long jid = Long.parseLong(idOrUniqId);
                    jkd = jkigramsDumpRepository.findById(jid).orElse(null);
                } catch (Exception ignored) {
                }
            }
            if (jkd != null) {
                return mapJkigramsToDetailDTO(jkd);
            }

            throw new RuntimeException("Grievance not found: " + idOrUniqId);
        }

        // Security check
        String role = "ROLE_Individual";
        if (currentUser.getUserType() != null) {
            role = currentUser.getUserType().getTypeName();
        } else if (currentUser.getRole() != null) {
            role = currentUser.getRole();
        }

        boolean isSuperAdmin = "ROLE_SuperAdmin".equalsIgnoreCase(role)
                || (currentUser.getEmail() != null && currentUser.getEmail().toLowerCase().contains("superadmin"))
                || (currentUser.getUsername() != null
                        && currentUser.getUsername().toLowerCase().contains("superadmin"));

        boolean isSubmitter = g.getSubmittedBy() != null && g.getSubmittedBy().getId().equals(currentUser.getId());

        boolean isDM = ("ROLE_DM".equalsIgnoreCase(role) || "DM".equalsIgnoreCase(role))
                && currentUser.getDistrictEntity() != null
                && g.getDistrict() != null
                && g.getDistrict().getId().equals(currentUser.getDistrictEntity().getId());

        boolean isDepartmentOfficer = ("ROLE_Department".equalsIgnoreCase(role) || "DEPARTMENT".equalsIgnoreCase(role)
                || "ROLE_Secretary".equalsIgnoreCase(role) || "SECRETARY".equalsIgnoreCase(role))
                && currentUser.getDepartment() != null
                && g.getCategory() != null
                && g.getCategory().getDepartment() != null
                && g.getCategory().getDepartment().getId().equals(currentUser.getDepartment().getId());

        if (!isSuperAdmin && !isSubmitter && !isDM && !isDepartmentOfficer) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not authorized to access this grievance detail.");
        }

        // Fetch history logs
        List<GrievanceHistory> historyLogs = grievanceHistoryRepository
                .findByGrievanceIdOrderByCreatedAtDesc(g.getId());
        List<GrievanceResponseDTO.HistoryItemDTO> historyDTOs = new ArrayList<>();

        for (int i = 0; i < historyLogs.size(); i++) {
            GrievanceHistory h = historyLogs.get(i);
            String actionUserType = "";
            if (h.getActionTakenBy() != null && h.getActionTakenBy().getUserType() != null) {
                actionUserType = h.getActionTakenBy().getUserType().getTypeName();
                if (actionUserType.startsWith("ROLE_")) {
                    actionUserType = actionUserType.substring(5);
                }
            }
            String actionByName = h.getActionTakenBy() != null ? h.getActionTakenBy().getName() : "System";
            String actionByVal = actionByName + (actionUserType.isEmpty() ? "" : " (" + actionUserType + ")");

            String deptName = "N/A";
            if (h.getActionTakenBy() != null && h.getActionTakenBy().getDepartment() != null) {
                deptName = h.getActionTakenBy().getDepartment().getName();
            }

            long daysDiff = 0;
            if (i + 1 < historyLogs.size()) {
                GrievanceHistory prev = historyLogs.get(i + 1);
                if (h.getCreatedAt() != null && prev.getCreatedAt() != null) {
                    daysDiff = java.time.Duration.between(prev.getCreatedAt(), h.getCreatedAt()).toDays();
                }
            }

            historyDTOs.add(GrievanceResponseDTO.HistoryItemDTO.builder()
                    .id(h.getId())
                    .uniqId(g.getUniqId())
                    .actionBy(actionByVal)
                    .dateTimeOfAction(h.getCreatedAt() != null ? h.getCreatedAt().toString() : "")
                    .actionTaken(h.getActionTaken() != null ? h.getActionTaken() : "Processed")
                    .remarks(h.getRemarks() != null ? h.getRemarks() : "N/A")
                    .privilegeAssign(g.getKeyFlag() != null ? g.getKeyFlag() : "Normal")
                    .department(deptName)
                    .status(h.getStatus() != null ? h.getStatus() : "Pending")
                    .actionTakenTimeDays(daysDiff)
                    .build());
        }

        java.util.Optional<AppealMaster> appealOpt = appealMasterRepository
                .findFirstByGrievanceIdOrderByIdDesc(g.getId());
        String appealDescription = appealOpt.map(AppealMaster::getDescription).orElse("N/A");

        return GrievanceResponseDTO.builder()
                .id(g.getId())
                .uniqId(g.getUniqId())
                .description(g.getDescription())
                .latitude(g.getLatitude() != null ? g.getLatitude() : "")
                .longitude(g.getLongitude() != null ? g.getLongitude() : "")
                .origin(g.getOrigin() != null ? g.getOrigin() : "JKSAMADHAN")
                .status(g.getStatus())
                .finalStatus(g.getFinalStatus())
                .keyFlag(g.getKeyFlag())
                .psga(g.getPsga())
                .fileName(g.getFileName())
                .filePath(g.getFilePath())
                .fileType(g.getFileType())
                .secondFileName(g.getSecondFileName())
                .secondFilePath(g.getSecondFilePath())
                .secondFileType(g.getSecondFileType())
                .ackSlipName(g.getAckSlipName())
                .ackSlipPath(g.getAckSlipPath())
                .cpgramRegNo(g.getCpgramRegNo())
                .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                .updatedAt(g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : "")
                .department(g.getCategory() != null && g.getCategory().getDepartment() != null
                        ? g.getCategory().getDepartment().getName()
                        : "General Administration")
                .grievanceCategory(
                        g.getCategory() != null ? g.getCategory().getName() : "General Complaints & Petitions")
                .subCategory(g.getSubCatL1() != null ? g.getSubCatL1().getName() : "NA")
                .subCategoryL2(g.getSubCatL2() != null ? g.getSubCatL2().getName() : "-")
                .subCategoryL3(g.getSubCatL3() != null ? g.getSubCatL3().getName() : "-")
                .subCategoryL4(g.getSubCatL4() != null ? g.getSubCatL4().getName() : "-")
                .district(g.getDistrict() != null ? g.getDistrict().getName() : "Srinagar")
                .division(g.getDistrict() != null && g.getDistrict().getDivision() != null
                        ? g.getDistrict().getDivision().getName()
                        : "Kashmir")
                .windowType(g.getOrigin())
                .citizenName(g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "CITIZEN USER")
                .citizenPhone(g.getSubmittedBy() != null ? g.getSubmittedBy().getMobile() : "N/A")
                .submittedBy(g.getSubmittedBy() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                        .id(g.getSubmittedBy().getId())
                        .name(g.getSubmittedBy().getName())
                        .mobile(g.getSubmittedBy().getMobile())
                        .email(g.getSubmittedBy().getEmail())
                        .gender(g.getSubmittedBy().getGender())
                        .build() : null)
                .block(g.getBlock() != null ? g.getBlock().getName() : "N/A")
                .panchayat(g.getPanchayat() != null ? g.getPanchayat().getName() : "N/A")
                .municipality(g.getMunicipality() != null ? g.getMunicipality().getName() : "N/A")
                .ward(g.getWard() != null ? g.getWard().getName() : "N/A")
                .emailId(g.getSubmittedBy() != null ? g.getSubmittedBy().getEmail() : "N/A")
                .address(g.getSubmittedBy() != null ? g.getSubmittedBy().getAddress() : "N/A")
                .appealDescription(appealDescription)
                .history(historyDTOs)
                .build();
    }

    public com.example.jk_samadhan_backend.dto.JkigramsDTO.Summary getJkigramsSummary() {
        long total = jkigramsDumpRepository.count();
        long pending = 0;
        long forwarded = 0;
        long remarkAdded = 0;
        long resolved = 0;
        long rejected = 0;
        long doesNotPertain = 0;

        try {
            pending = jdbcTemplate.queryForObject("SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Pending'",
                    Long.class);
        } catch (Exception ignored) {
        }
        try {
            forwarded = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Forwarded'", Long.class);
        } catch (Exception ignored) {
        }
        try {
            remarkAdded = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Remark Added'", Long.class);
        } catch (Exception ignored) {
        }
        try {
            resolved = jdbcTemplate
                    .queryForObject("SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Resolved'", Long.class);
        } catch (Exception ignored) {
        }
        try {
            rejected = jdbcTemplate
                    .queryForObject("SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Rejected'", Long.class);
        } catch (Exception ignored) {
        }
        try {
            doesNotPertain = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM jks_3nf.jkigrams_dump WHERE status = 'Does Not Pertain' OR status = 'dnpToOffice'",
                    Long.class);
        } catch (Exception ignored) {
        }

        return com.example.jk_samadhan_backend.dto.JkigramsDTO.Summary.builder()
                .totalGrievanceReceived(total)
                .pendingWithDepartment(pending)
                .forwarded(forwarded)
                .remarkAdded(remarkAdded)
                .resolved(resolved)
                .rejected(rejected)
                .doesNotPertain(doesNotPertain)
                .build();
    }

    public com.example.jk_samadhan_backend.dto.JkigramsDTO.PaginatedResponse getJkigramsGrievances(
            String search, String status, String department, String category,
            org.springframework.data.domain.PageRequest pageRequest) {
        org.springframework.data.jpa.domain.Specification<com.example.jk_samadhan_backend.models.JkigramsDump> spec = com.example.jk_samadhan_backend.repositories.JkigramsSpecification
                .getJkigramsSpec(search, status, department, category);

        org.springframework.data.domain.Page<com.example.jk_samadhan_backend.models.JkigramsDump> pageResult = jkigramsDumpRepository
                .findAll(spec, pageRequest);

        List<com.example.jk_samadhan_backend.dto.JkigramsDTO.Item> content = pageResult.getContent().stream()
                .map(this::mapJkigramsDumpToDTO)
                .collect(Collectors.toList());

        return com.example.jk_samadhan_backend.dto.JkigramsDTO.PaginatedResponse.builder()
                .content(content)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .currentPage(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .build();
    }

    private com.example.jk_samadhan_backend.dto.JkigramsDTO.Item mapJkigramsDumpToDTO(
            com.example.jk_samadhan_backend.models.JkigramsDump d) {
        String dateStr = "";
        if (d.getApplicationDate() != null) {
            dateStr = d.getApplicationDate().toLocalDate().toString();
        }

        return com.example.jk_samadhan_backend.dto.JkigramsDTO.Item.builder()
                .id(d.getId())
                .referenceId(d.getReferenceId() != null ? d.getReferenceId() : "")
                .category(d.getGrievanceType() != null ? d.getGrievanceType() : "Other Types")
                .submittedOn(dateStr)
                .applicantName(d.getApplicantName() != null ? d.getApplicantName() : "")
                .applicantGender(d.getGender() != null ? d.getGender() : "")
                .applicantEmail(d.getEmailid() != null ? d.getEmailid() : "")
                .mobileNo(d.getMobileno() != null ? d.getMobileno() : "")
                .constituency(d.getConstituency() != null ? d.getConstituency() : "CITIZEN")
                .cpgramsRegNo(d.getCpgramsRegno() != null ? d.getCpgramsRegno() : "")
                .pendingWith(d.getPendingAt() != null ? d.getPendingAt() : "")
                .jkigramsStatus(d.getCurrentStatus() != null ? d.getCurrentStatus() : "")
                .jksamadhanStatus(d.getStatus() != null ? d.getStatus() : "Pending")
                .description(d.getDescription() != null ? d.getDescription() : "")
                .department(d.getDepartment() != null ? d.getDepartment() : "")
                .address(d.getAddress() != null ? d.getAddress() : "")
                .pincode(d.getPincode() != null ? d.getPincode() : "")
                .appFileName(d.getAppFileName())
                .appFilePath(d.getAppFilePath())
                .deptFileName(d.getDeptFileName())
                .deptFilePath(d.getDeptFilePath())
                .build();
    }

    private GrievanceResponseDTO mapJkigramsToDetailDTO(com.example.jk_samadhan_backend.models.JkigramsDump d) {
        List<com.example.jk_samadhan_backend.models.JkigramsMovementLog> logs = jkigramsMovementLogRepository
                .findByReferenceIdOrderBySnoAsc(d.getReferenceId());

        List<GrievanceResponseDTO.HistoryItemDTO> historyDTOs = new ArrayList<>();
        if (logs != null && !logs.isEmpty()) {
            for (com.example.jk_samadhan_backend.models.JkigramsMovementLog log : logs) {
                historyDTOs.add(GrievanceResponseDTO.HistoryItemDTO.builder()
                        .id(log.getId())
                        .uniqId(d.getReferenceId())
                        .actionBy(log.getApplicantName() != null ? log.getApplicantName()
                                : (log.getDepartment() != null ? log.getDepartment() : "Department Officer"))
                        .dateTimeOfAction(log.getDate() != null ? log.getDate().toString() : "")
                        .actionTaken(log.getCurrentStatus() != null ? log.getCurrentStatus() : "Action Processed")
                        .remarks(log.getDescription() != null ? log.getDescription() : "")
                        .privilegeAssign("Normal")
                        .department(log.getDepartment() != null ? log.getDepartment() : d.getDepartment())
                        .status(log.getCurrentStatus() != null ? log.getCurrentStatus() : "Pending")
                        .actionTakenTimeDays(0L)
                        .build());
            }
        }

        String dateStr = d.getApplicationDate() != null ? d.getApplicationDate().toString() : "";

        return GrievanceResponseDTO.builder()
                .id(d.getId())
                .uniqId(d.getReferenceId())
                .description(d.getDescription() != null ? d.getDescription() : "")
                .latitude("")
                .longitude("")
                .origin("JKIGRAMS")
                .status(d.getStatus() != null ? d.getStatus() : "Pending")
                .finalStatus(d.getFinalStatus() != null ? d.getFinalStatus() : "Submitted")
                .keyFlag("Normal")
                .psga("NA")
                .fileName(d.getAppFileName())
                .filePath(d.getAppFilePath())
                .fileType("PDF")
                .secondFileName(d.getDeptFileName())
                .secondFilePath(d.getDeptFilePath())
                .secondFileType("PDF")
                .ackSlipName("")
                .ackSlipPath("")
                .cpgramRegNo(d.getCpgramsRegno() != null ? d.getCpgramsRegno() : "")
                .createdAt(dateStr)
                .updatedAt(d.getUpdatedOn() != null ? d.getUpdatedOn().toString() : dateStr)
                .department(d.getDepartment() != null ? d.getDepartment() : "General Administration")
                .grievanceCategory(d.getGrievanceType() != null ? d.getGrievanceType() : "Other Types")
                .subCategory("NA")
                .subCategoryL2("-")
                .subCategoryL3("-")
                .subCategoryL4("-")
                .district("NA")
                .division("UT")
                .windowType("JKIGRAMS")
                .citizenName(d.getApplicantName() != null ? d.getApplicantName() : "CITIZEN USER")
                .citizenPhone(d.getMobileno() != null ? d.getMobileno() : "N/A")
                .submittedBy(GrievanceResponseDTO.ComplainantInfo.builder()
                        .id(d.getId())
                        .name(d.getApplicantName())
                        .mobile(d.getMobileno())
                        .email(d.getEmailid())
                        .gender(d.getGender())
                        .address(d.getAddress())
                        .build())
                .block("N/A")
                .panchayat("N/A")
                .municipality("N/A")
                .ward("N/A")
                .emailId(d.getEmailid() != null ? d.getEmailid() : "N/A")
                .address(d.getAddress() != null ? d.getAddress() : "N/A")
                .appealDescription("N/A")
                .history(historyDTOs)
                .build();
    }

    private GrievanceResponseDTO mapCpgramToDetailDTO(com.example.jk_samadhan_backend.models.CpgramGrievanceMaster c) {
        String dept = c.getForwardedDepartment() != null && !c.getForwardedDepartment().trim().isEmpty()
                ? c.getForwardedDepartment()
                : (c.getFromOrgName() != null ? c.getFromOrgName() : "DOPG");
        String cat = c.getCategory() != null && !c.getCategory().trim().isEmpty() ? c.getCategory()
                : "Central Grievance";
        String dateStr = c.getCreatedDate() != null ? c.getCreatedDate().toString()
                : (c.getDateOfReceipt() != null ? c.getDateOfReceipt() : "");
        String phone = c.getMobileNo() != null && !c.getMobileNo().trim().isEmpty() ? c.getMobileNo()
                : (c.getPhoneNo() != null ? c.getPhoneNo() : "");
        String name = c.getName() != null && !c.getName().trim().isEmpty() ? c.getName() : "CITIZEN USER";

        List<GrievanceResponseDTO.HistoryItemDTO> historyDTOs = new ArrayList<>();
        if (c.getNodalOfficer() != null || c.getRemark() != null || c.getUpdatedBy() != null) {
            historyDTOs.add(GrievanceResponseDTO.HistoryItemDTO.builder()
                    .id((long) c.getId())
                    .uniqId(c.getRegistrationNo())
                    .actionBy(c.getNodalOfficer() != null ? c.getNodalOfficer()
                            + (c.getNodalOfficerDesignation() != null ? " (" + c.getNodalOfficerDesignation() + ")"
                                    : "")
                            : "Nodal Officer")
                    .dateTimeOfAction(c.getUpdatedDate() != null ? c.getUpdatedDate().toString() : dateStr)
                    .actionTaken(c.getStatus() != null ? c.getStatus() : "Under Process")
                    .remarks(c.getRemark() != null ? c.getRemark() : "CPGRAMS Process Updated")
                    .privilegeAssign("Normal")
                    .department(dept)
                    .status(c.getStatus())
                    .actionTakenTimeDays(0L)
                    .build());
        }

        return GrievanceResponseDTO.builder()
                .id((long) c.getId())
                .uniqId(c.getRegistrationNo())
                .description(c.getSubjectContent() != null ? c.getSubjectContent() : "")
                .latitude("")
                .longitude("")
                .origin("CPGRAMS")
                .status(c.getStatus() != null ? c.getStatus() : "Pending")
                .finalStatus(c.getFinalStatus() != null ? c.getFinalStatus() : "Submitted")
                .keyFlag("Normal")
                .psga("NA")
                .fileName(c.getFileName())
                .filePath(c.getFilePath())
                .fileType("PDF")
                .secondFileName(c.getDeptFileName())
                .secondFilePath(c.getDepdocument())
                .secondFileType("PDF")
                .ackSlipName(c.getAttachDoc())
                .ackSlipPath(c.getAttachDoc())
                .cpgramRegNo(c.getRegistrationNo())
                .createdAt(dateStr)
                .updatedAt(c.getUpdatedDate() != null ? c.getUpdatedDate().toString() : "")
                .department(dept)
                .grievanceCategory(cat)
                .subCategory("NA")
                .subCategoryL2("-")
                .subCategoryL3("-")
                .subCategoryL4("-")
                .district(c.getDistrict() != null && !c.getDistrict().trim().isEmpty() ? c.getDistrict() : "NA")
                .division("UT")
                .windowType("CPGRAMS")
                .citizenName(name)
                .citizenPhone(phone)
                .submittedBy(GrievanceResponseDTO.ComplainantInfo.builder()
                        .id((long) c.getId())
                        .name(name)
                        .mobile(phone)
                        .email(c.getEmailAddress())
                        .gender(c.getGender())
                        .address(c.getAddress1() != null
                                ? (c.getAddress1() + (c.getAddress2() != null ? ", " + c.getAddress2() : ""))
                                : "")
                        .build())
                .block("N/A")
                .panchayat("N/A")
                .municipality("N/A")
                .ward("N/A")
                .emailId(c.getEmailAddress() != null ? c.getEmailAddress() : "N/A")
                .address(c.getAddress1() != null
                        ? (c.getAddress1() + (c.getAddress2() != null ? ", " + c.getAddress2() : ""))
                        : "N/A")
                .appealDescription("N/A")
                .history(historyDTOs)
                .build();
    }

    public com.example.jk_samadhan_backend.dto.PaginatedDepartmentUserReportDTO getDepartmentUserReport(
            int page, int size, String search, String department, String departmentType, String userType, String district) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        
        List<Object[]> rawList = userRepository.fetchDepartmentUserReportRaw(search, department, departmentType, userType, district, pageable);
        long totalElements = userRepository.countDepartmentUserReportRaw(search, department, departmentType, userType, district);

        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        List<com.example.jk_samadhan_backend.dto.DepartmentUserReportDTO> content = new java.util.ArrayList<>();
        for (Object[] row : rawList) {
            Long id = ((Number) row[0]).longValue();
            String uname = row[1] != null ? row[1].toString() : "";
            String mail = row[2] != null ? row[2].toString() : "";
            String nameVal = row[3] != null ? row[3].toString() : "";
            String deptVal = row[4] != null ? row[4].toString() : "";
            String deptTypeVal = row[5] != null ? row[5].toString() : "";
            String distVal = row[6] != null ? row[6].toString() : "";
            String officeVal = row[7] != null ? row[7].toString() : "";
            String desgVal = row[8] != null ? row[8].toString() : "";
            String usrTypeVal = row[9] != null ? row[9].toString() : "";
            String createdByVal = row[10] != null ? row[10].toString() : "";
            
            String dateStr = "N/A";
            if (row[11] instanceof java.time.OffsetDateTime odt) {
                dateStr = odt.format(dtf);
            } else if (row[11] instanceof java.time.LocalDateTime ldt) {
                dateStr = ldt.format(dtf);
            } else if (row[11] instanceof java.util.Date d) {
                dateStr = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(d);
            } else if (row[11] != null) {
                dateStr = row[11].toString();
            }

            String mobileVal = row[12] != null ? row[12].toString() : "N/A";
            Boolean enabledVal = Boolean.TRUE.equals(row[13]);

            content.add(com.example.jk_samadhan_backend.dto.DepartmentUserReportDTO.builder()
                    .id(id)
                    .username(uname)
                    .email(mail)
                    .name(nameVal)
                    .department(deptVal)
                    .departmentType(deptTypeVal)
                    .district(distVal)
                    .office(officeVal)
                    .designation(desgVal)
                    .userType(usrTypeVal)
                    .createdBy(createdByVal)
                    .createdAt(dateStr)
                    .mobile(mobileVal)
                    .enabled(enabledVal)
                    .build());
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        List<String> depts = departmentRepository.findAll().stream()
                .map(com.example.jk_samadhan_backend.models.Department::getName)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        List<String> deptTypes = java.util.List.of("ADMIN", "DOPG", "OTHER");
        List<String> usrTypes = java.util.List.of("Administrative", "Appellate", "District", "HOD", "DEALINGHAND", "ROLE_Admin");

        List<String> dists = districtRepository.findAll().stream()
                .map(com.example.jk_samadhan_backend.models.District::getName)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .sorted()
                .toList();

        return com.example.jk_samadhan_backend.dto.PaginatedDepartmentUserReportDTO.builder()
                .content(content)
                .currentPage(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .departments(depts)
                .departmentTypes(deptTypes)
                .userTypes(usrTypes)
                .districts(dists)
                .build();
    }

    public com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO getStatusWiseReport(
            String mode, int page, int size, String search) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        String reportMode = (mode != null && mode.equalsIgnoreCase("user")) ? "user" : "department";
        
        List<com.example.jk_samadhan_backend.dto.StatusWiseReportDTO> content = new java.util.ArrayList<>();
        long totalElements = 0;

        if ("user".equalsIgnoreCase(reportMode)) {
            List<Object[]> rawList = grievanceMasterRepository.fetchUserWiseStatusRaw(search, pageable);
            totalElements = grievanceMasterRepository.countUserWiseStatusRaw(search);

            for (Object[] row : rawList) {
                Long id = row[0] != null ? ((Number) row[0]).longValue() : null;
                String officerName = row[1] != null ? row[1].toString() : "";
                String officeDesg = row[2] != null ? row[2].toString() : "";
                String deptName = row[3] != null ? row[3].toString() : "";
                String usrType = row[4] != null ? row[4].toString() : "";
                String usrLevel = row[5] != null ? row[5].toString() : "";
                String uname = row[6] != null ? row[6].toString() : "";

                long total = row[7] != null ? ((Number) row[7]).longValue() : 0;
                long resolved = row[8] != null ? ((Number) row[8]).longValue() : 0;
                long pending = row[9] != null ? ((Number) row[9]).longValue() : 0;
                long forwarded = row[10] != null ? ((Number) row[10]).longValue() : 0;
                long dnp = row[11] != null ? ((Number) row[11]).longValue() : 0;
                long remark = row[12] != null ? ((Number) row[12]).longValue() : 0;
                long rejected = row[13] != null ? ((Number) row[13]).longValue() : 0;
                long appealed = row[14] != null ? ((Number) row[14]).longValue() : 0;

                content.add(com.example.jk_samadhan_backend.dto.StatusWiseReportDTO.builder()
                        .id(id)
                        .officerName(officerName)
                        .officeAndDesignation(officeDesg)
                        .departmentName(deptName)
                        .userType(usrType)
                        .userLevel(usrLevel)
                        .username(uname)
                        .totalCount(total)
                        .resolvedCount(resolved)
                        .pendingCount(pending)
                        .forwardedCount(forwarded)
                        .dnpCount(dnp)
                        .remarkCount(remark)
                        .rejectedCount(rejected)
                        .appealedCount(appealed)
                        .build());
            }
        } else {
            List<Object[]> rawList = grievanceMasterRepository.fetchDepartmentWiseStatusRaw(search, pageable);
            totalElements = grievanceMasterRepository.countDepartmentWiseStatusRaw(search);

            for (Object[] row : rawList) {
                String deptName = row[0] != null ? row[0].toString() : "Unassigned";
                long total = row[1] != null ? ((Number) row[1]).longValue() : 0;
                long resolved = row[2] != null ? ((Number) row[2]).longValue() : 0;
                long forwarded = row[3] != null ? ((Number) row[3]).longValue() : 0;
                long dnp = row[4] != null ? ((Number) row[4]).longValue() : 0;
                long pending = row[5] != null ? ((Number) row[5]).longValue() : 0;
                long rejected = row[6] != null ? ((Number) row[6]).longValue() : 0;
                long appealed = row[7] != null ? ((Number) row[7]).longValue() : 0;

                content.add(com.example.jk_samadhan_backend.dto.StatusWiseReportDTO.builder()
                        .departmentName(deptName)
                        .totalCount(total)
                        .resolvedCount(resolved)
                        .forwardedCount(forwarded)
                        .dnpCount(dnp)
                        .pendingCount(pending)
                        .rejectedCount(rejected)
                        .appealedCount(appealed)
                        .build());
            }
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return com.example.jk_samadhan_backend.dto.PaginatedStatusWiseReportDTO.builder()
                .mode(reportMode)
                .content(content)
                .currentPage(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    public PaginatedGrievancesResponseDTO getStatusWiseGrievanceDetailsModal(
            String department, String username, String status, int page, int size, String search) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        List<Object[]> rawList = grievanceMasterRepository.fetchStatusWiseGrievanceDetailsRaw(department, username, status, search, pageable);
        long totalElements = grievanceMasterRepository.countStatusWiseGrievanceDetailsRaw(department, username, status, search);

        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        List<GrievanceResponseDTO> content = new java.util.ArrayList<>();
        for (Object[] row : rawList) {
            Long id = ((Number) row[0]).longValue();
            String uniqId = row[1] != null ? row[1].toString() : "";
            String dept = row[2] != null ? row[2].toString() : "";
            String cat = row[3] != null ? row[3].toString() : "";
            String submitter = row[4] != null ? row[4].toString() : "";

            String dateStr = "N/A";
            if (row[5] instanceof java.time.OffsetDateTime odt) {
                dateStr = odt.format(dtf);
            } else if (row[5] instanceof java.time.LocalDateTime ldt) {
                dateStr = ldt.format(dtf);
            } else if (row[5] instanceof java.util.Date d) {
                dateStr = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(d);
            } else if (row[5] != null) {
                dateStr = row[5].toString();
            }

            String st = row[6] != null ? row[6].toString() : "Pending";

            content.add(GrievanceResponseDTO.builder()
                    .id(id)
                    .uniqId(uniqId)
                    .department(dept)
                    .grievanceCategory(cat)
                    .submittedBy(GrievanceResponseDTO.ComplainantInfo.builder().name(submitter).build())
                    .createdAt(dateStr)
                    .status(st)
                    .finalStatus(st)
                    .origin("JK-SAMADHAN")
                    .build());
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedGrievancesResponseDTO.builder()
                .content(content)
                .currentPage(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    public List<Map<String, Object>> getTreeDepartments() {
        String sql = """
            SELECT DISTINCT name FROM (
                SELECT name FROM jks_3nf.departments WHERE name IS NOT NULL AND TRIM(name) != ''
                UNION
                SELECT department AS name FROM jks_3nf.jkigrams_dump WHERE department IS NOT NULL AND TRIM(department) != ''
            ) dept_list ORDER BY name ASC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getTreeMainCategories(String departmentName) {
        String deptFilter = (departmentName == null || departmentName.trim().isEmpty() || "0".equals(departmentName) || "all".equalsIgnoreCase(departmentName)) ? null : departmentName.trim();
        String sql = """
            SELECT category_name, SUM(cnt) AS count FROM (
                SELECT c.name AS category_name, COUNT(g.id) AS cnt
                FROM jks_3nf.categories c
                JOIN jks_3nf.departments d ON c.department_id = d.id
                LEFT JOIN jks_3nf.grievance_master g ON g.category_id = c.id
                WHERE (? IS NULL OR LOWER(d.name) = LOWER(?))
                GROUP BY c.id, c.name
                UNION ALL
                SELECT COALESCE(grievance_type, 'General') AS category_name, COUNT(*) AS cnt
                FROM jks_3nf.jkigrams_dump
                WHERE (? IS NULL OR LOWER(department) LIKE LOWER(CONCAT('%', ?, '%')))
                GROUP BY grievance_type
            ) combined
            WHERE category_name IS NOT NULL AND TRIM(category_name) != ''
            GROUP BY category_name
            ORDER BY SUM(cnt) DESC, category_name ASC
        """;
        return jdbcTemplate.queryForList(sql, deptFilter, deptFilter, deptFilter, deptFilter);
    }

    public List<Map<String, Object>> getTreeSubCategoriesL1(String departmentName, String categoryName) {
        String deptFilter = (departmentName == null || departmentName.trim().isEmpty() || "0".equals(departmentName) || "all".equalsIgnoreCase(departmentName)) ? null : departmentName.trim();
        String catFilter = (categoryName == null || categoryName.trim().isEmpty()) ? null : categoryName.trim();
        String sql = """
            SELECT sub_category_name, SUM(cnt) AS count FROM (
                SELECT s.name AS sub_category_name, COUNT(g.id) AS cnt
                FROM jks_3nf.subcategory_level1 s
                JOIN jks_3nf.categories c ON s.category_id = c.id
                JOIN jks_3nf.departments d ON c.department_id = d.id
                LEFT JOIN jks_3nf.grievance_master g ON g.sub_cat_l1_id = s.id
                WHERE (? IS NULL OR LOWER(c.name) = LOWER(?))
                  AND (? IS NULL OR LOWER(d.name) = LOWER(?))
                GROUP BY s.id, s.name
                UNION ALL
                SELECT COALESCE(current_status, 'Under Process') AS sub_category_name, COUNT(*) AS cnt
                FROM jks_3nf.jkigrams_dump
                WHERE (? IS NULL OR LOWER(grievance_type) = LOWER(?))
                  AND (? IS NULL OR LOWER(department) LIKE LOWER(CONCAT('%', ?, '%')))
                GROUP BY current_status
            ) combined
            WHERE sub_category_name IS NOT NULL AND TRIM(sub_category_name) != ''
            GROUP BY sub_category_name
            ORDER BY SUM(cnt) DESC, sub_category_name ASC
        """;
        return jdbcTemplate.queryForList(sql, catFilter, catFilter, deptFilter, deptFilter, catFilter, catFilter, deptFilter, deptFilter);
    }

    public List<Map<String, Object>> getTreeGrievanceList(String departmentName, String categoryName, String subCategoryName) {
        String deptFilter = (departmentName == null || departmentName.trim().isEmpty() || "0".equals(departmentName) || "all".equalsIgnoreCase(departmentName)) ? null : departmentName.trim();
        String catFilter = (categoryName == null || categoryName.trim().isEmpty()) ? null : categoryName.trim();
        String subCatFilter = (subCategoryName == null || subCategoryName.trim().isEmpty()) ? null : subCategoryName.trim();

        String sql = """
            SELECT id, reference_id AS grievanceId, department, grievance_type AS category, applicant_name AS submittedBy, current_status AS status, application_date AS date
            FROM jks_3nf.jkigrams_dump
            WHERE (? IS NULL OR LOWER(department) LIKE LOWER(CONCAT('%', ?, '%')))
              AND (? IS NULL OR LOWER(grievance_type) = LOWER(?))
              AND (? IS NULL OR LOWER(current_status) = LOWER(?))
            ORDER BY application_date DESC
            LIMIT 100
        """;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, deptFilter, deptFilter, catFilter, catFilter, subCatFilter, subCatFilter);
        if (list == null || list.isEmpty()) {
            String sql2 = """
                SELECT g.id, g.uniq_id AS grievanceId, d.name AS department, c.name AS category, u.username AS submittedBy, g.status AS status, g.created_at AS date
                FROM jks_3nf.grievance_master g
                LEFT JOIN jks_3nf.categories c ON g.category_id = c.id
                LEFT JOIN jks_3nf.departments d ON c.department_id = d.id
                LEFT JOIN jks_3nf.users u ON g.submitted_by_user_id = u.id
                WHERE (? IS NULL OR LOWER(d.name) = LOWER(?))
                  AND (? IS NULL OR LOWER(c.name) = LOWER(?))
                ORDER BY g.created_at DESC
                LIMIT 100
            """;
            list = jdbcTemplate.queryForList(sql2, deptFilter, deptFilter, catFilter, catFilter);
        }
        return list;
    }
}
